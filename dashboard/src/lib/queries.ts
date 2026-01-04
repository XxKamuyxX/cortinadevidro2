import { collection, query, where, QueryConstraint } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Helper function to create a query with companyId filter
 * Usage: const q = queryWithCompanyId('clients', companyId);
 */
export function queryWithCompanyId(collectionName: string, companyId: string, ...additionalConstraints: QueryConstraint[]) {
  const baseQuery = collection(db, collectionName);
  const constraints = [where('companyId', '==', companyId), ...additionalConstraints];
  return query(baseQuery, ...constraints);
}

/**
 * Hook to get companyId from auth context
 * Throws error if companyId is not available
 */
export function useCompanyId(): string {
  const { userMetadata } = useAuth();
  
  if (!userMetadata || !userMetadata.companyId) {
    throw new Error('Usuário deve ter um companyId. Por favor, entre em contato com o administrador.');
  }
  
  return userMetadata.companyId;
}
