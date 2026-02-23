import { useQuery, useMutation } from '@tanstack/react-query';

import ConsumApi from 'src/services_workers/consum_api';

const getmoovies = async () => {
  try {
    return await ConsumApi.getmoovies();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCategoriesmoovies = async () => {
  try {
    return await ConsumApi.getCategoriesmoovies();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const usemoovies = () => useQuery({
  queryKey: ['moovies'],
  queryFn: getmoovies,
  staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
  retry: 1, // Ne réessaye qu'une seule fois en cas d'erreur
  enabled: true, // S'assurer que la requête est activée
  refetchOnMount: true, // Recharger au montage du composant
});

export const useCategoriesmoovies = () => useQuery({
  queryKey: ['categories'],
  queryFn: getCategoriesmoovies,
  staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
  retry: 1, // Ne réessaye qu'une seule fois en cas d'erreur
  enabled: true, // S'assurer que la requête est activée
  refetchOnMount: true, // Recharger au montage du composant
});

// --- Partie POST pour créer
const createGame = async ({ nameProfil, base64Profil, title, description, trailler, covers, episodes, priceEpisode, categories }) => {
  try {
    return await ConsumApi.createGame({ nameProfil, base64Profil, title, description, trailler, covers: covers.reverse(), episodes, priceEpisode, categories });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createCategorymoovies = async ({ name}) => {
  try {
    return await ConsumApi.createCategorymoovies({ name});
  } catch (error) {
    throw new Error(error.message);
  }
};

export const useCreateGame = () => useMutation({
  mutationFn: createGame,
});

export const useCreateCategorymoovies = () => useMutation({
  mutationFn: createCategorymoovies,
});
