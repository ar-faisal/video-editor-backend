'use client';
import { Provider } from 'react-redux';
import { store } from './store';
import { useDispatch, useSelector, useStore } from 'react-redux'

export default function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}


export const useAppDispatch = useDispatch
export const useAppSelector = useSelector
export const useAppStore = useStore