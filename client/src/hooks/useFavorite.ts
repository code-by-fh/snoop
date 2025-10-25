import { useState } from 'react';
import { addFavorite, removeFavorite } from '@/api';
import toast from 'react-hot-toast';

export const useFavorite = (initial: boolean) => {
  const [favorited, setFavorited] = useState(initial);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (id: string) => {
    if (loading) return;
    setLoading(true);

    try {
      if (favorited) {
        await removeFavorite(id);
        toast.success('Removed from favorites');
      } else {
        await addFavorite(id);
        toast.success('Added to favorites');
      }
      setFavorited(!favorited);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update favorite');
    } finally {
      setLoading(false);
    }
  };

  return { favorited, toggleFavorite, loading };
};
