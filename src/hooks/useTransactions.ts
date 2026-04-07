import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Transaction {
  id: string;
  transaction_date: string;
  amount: number;
  description: string;
  category: string;
  transaction_type: 'income' | 'expense';
  payment_method: 'cash' | 'transfer';
  image_url?: string;
  created_at: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch latest transactions from Supabase
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (fetchError) throw fetchError;
      setTransactions(data as Transaction[] || []);
    } catch (err: any) {
      console.error('Error fetching transactions:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from('transactions').insert([transaction]);
      if (error) throw error;
      fetchTransactions();
    } catch (err: any) {
      console.error('Error adding transaction:', err.message);
      throw err;
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    try {
      const { error } = await supabase.from('transactions').update(transaction).eq('id', id);
      if (error) throw error;
      fetchTransactions();
    } catch (err: any) {
      console.error('Error updating transaction:', err.message);
      throw err;
    }
  };

  const uploadReceipt = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('receipts').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err: any) {
      console.error('Error uploading receipt:', err.message);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      fetchTransactions();
    } catch (err: any) {
      console.error('Error deleting transaction:', err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Derived calculations
  const incomes = transactions.filter(t => t.transaction_type === 'income');
  const expenses = transactions.filter(t => t.transaction_type === 'expense');

  const totalIncome = incomes.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const balance = totalIncome - totalExpense;

  return {
    transactions,
    incomes,
    expenses,
    totalIncome,
    totalExpense,
    balance,
    loading,
    error,
    refresh: fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    uploadReceipt
  };
}
