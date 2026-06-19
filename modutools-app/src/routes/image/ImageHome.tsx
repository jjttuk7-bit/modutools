import React from 'react';
import CategoryHome from '../_CategoryHome';
import { categoryById } from '../../data/categories';

export default function ImageHome() {
  return <CategoryHome category={categoryById['image']} />;
}
