import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

export function useCategories(type?: 'income' | 'expense') {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      let query = supabase.from('categories').select('*').order('name');
      
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      setCategories(data as Category[]);
    } catch (err: any) {
      console.error('Error fetching categories:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [type]);

  const addCategory = async (name: string, catType: 'income' | 'expense') => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, type: catType }])
        .select();
        
      if (error) throw error;
      await fetchCategories();
      return data?.[0] as Category;
    } catch (err: any) {
      console.error('Error adding category:', err.message);
      throw err;
    }
  };

  return { categories, loading, addCategory, refresh: fetchCategories };
}
