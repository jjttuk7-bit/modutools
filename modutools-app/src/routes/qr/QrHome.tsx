import React from 'react';
import CategoryHome from '../_CategoryHome';
import { categoryById } from '../../data/categories';
import QrHomeContent from '../../components/qr/QrHomeContent';

export default function QrHome() {
  return (
    <>
      <CategoryHome category={categoryById['qr']} />
      <QrHomeContent />
    </>
  );
}
