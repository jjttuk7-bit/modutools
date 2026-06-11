import CategoryHome from '../_CategoryHome';
import { categoryById } from '../../data/categories';
import ExcelSeo from '../../components/seo/ExcelSeo';

export default function ExcelHome() {
  return (
    <>
      <CategoryHome category={categoryById['excel']} />
      <ExcelSeo />
    </>
  );
}
