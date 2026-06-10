import React from 'react';
import CategoryHome from '../_CategoryHome';
import { categoryById } from '../../data/categories';
import BusinessSeo from '../../components/seo/BusinessSeo';

export default function BusinessHome() {
  return (
    <>
      <CategoryHome category={categoryById['business']} />
      <BusinessSeo toolId="home" />
    </>
  );
}
