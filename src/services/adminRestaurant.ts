import API from './api';
import { Restaurant } from '../types/domain';

export type AdminUserLike = {
  id?: string;
  _id?: string;
  restaurant?: string | { name?: string };
  restaurantName?: string;
  restaurantId?: string;
} | null | undefined;

export const getRestaurantOwnerId = (owner?: string | { _id?: string; id?: string } | null) => {
  if (!owner) return undefined;
  if (typeof owner === 'string') return owner;
  return owner._id || owner.id;
};

export const findRestaurantForUser = (
  restaurants: Restaurant[],
  user: AdminUserLike,
): Restaurant | undefined => {
  if (!user) return undefined;

  const candidateIds = new Set<string>([
    user.id || '',
    user._id || '',
    user.restaurantId || '',
    typeof user.restaurant === 'string' ? user.restaurant : '',
    typeof user.restaurantName === 'string' ? user.restaurantName : '',
  ].filter(Boolean));

  const restaurantNames = new Set<string>([
    typeof user.restaurantName === 'string' ? user.restaurantName.trim().toLowerCase() : '',
    typeof user.restaurant === 'string' ? user.restaurant.trim().toLowerCase() : '',
    typeof user.restaurant === 'object' && user.restaurant && typeof user.restaurant.name === 'string'
      ? user.restaurant.name.trim().toLowerCase()
      : '',
  ].filter(Boolean));

  if (candidateIds.size === 0 && restaurantNames.size === 0) return undefined;

  const directMatches = restaurants.filter((restaurant) => candidateIds.has(restaurant._id));
  if (directMatches.length === 1) return directMatches[0];
  if (directMatches.length > 1) return undefined;

  if (user.restaurantId) {
    const restaurantById = restaurants.find((restaurant) => restaurant._id === user.restaurantId);
    if (restaurantById) return restaurantById;
  }

  const nameMatches = restaurants.filter((restaurant) => {
    if (!restaurant.name) return false;
    const normalizedRestaurantName = restaurant.name.trim().toLowerCase();
    return Array.from(restaurantNames).includes(normalizedRestaurantName);
  });

  if (nameMatches.length === 1) return nameMatches[0];
  if (nameMatches.length > 1) return undefined;

  const ownerMatches = restaurants.filter((restaurant) => {
    const ownerId = getRestaurantOwnerId(restaurant.owner);
    return ownerId ? candidateIds.has(ownerId) : false;
  });

  if (ownerMatches.length === 1) return ownerMatches[0];
  if (ownerMatches.length > 1) return undefined;

  return undefined;
};

export const fetchCurrentAdminRestaurant = async (user: AdminUserLike): Promise<Restaurant | null> => {
  if (!user) return null;

  const res = await API.get('/restaurants');
  const restaurants: Restaurant[] = Array.isArray(res.data?.restaurants) ? res.data.restaurants : [];
  const matchedRestaurant = findRestaurantForUser(restaurants, user);

  if (!matchedRestaurant) {
    return null;
  }

  return matchedRestaurant;
};
