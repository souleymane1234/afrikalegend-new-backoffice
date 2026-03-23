import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import { JobOfferView } from 'src/sections/job-offer/view';

// ----------------------------------------------------------------------

export default function JobOfferPage() {
  const location = useLocation();
  const isProductionHouse = location.pathname.includes('maison-de-production');
  const pageTitle = isProductionHouse ? 'Maison de Production | BoozGame' : 'Partenaires | BoozGame';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <JobOfferView />
    </>
  );
}
