import React from 'react';
import CategoryHome from '../_CategoryHome';
import { categoryById } from '../../data/categories';
import ThumbnailSeo from '../../components/seo/ThumbnailSeo';

export default function ThumbnailHome() {
  return (
    <>
      <CategoryHome category={categoryById['thumbnail']} />
      <ThumbnailSeo toolId="home" />
    </>
  );
}
