import React, { lazy } from 'react';

const MaskTool = lazy(() => import('../../tools/mask/MaskTool'));

export default function MaskHome() {
  return <MaskTool />;
}
