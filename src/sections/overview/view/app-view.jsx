// import { faker } from '@faker-js/faker';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import ConsumApi from 'src/services_workers/consum_api';
// import Iconify from 'src/components/iconify';

// import AppTasks from '../app-tasks';
// import { apiUrlAsset } from 'src/constants/apiUrl';

// import AppNewsUpdate from '../app-news-update';
// import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
// import AppTrafficBySite from '../app-traffic-by-site';
// import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';
// ----------------------------------------------------------------------

export default function AppView() {
  const router = useRouter();

  // const [data, setData] = useState({});
  const [isFetching, setFetch] = useState(true);
  // const [lastSixJTrainings, setLastSixJTrainings] = useState([]);
  // const [lastSixJobOffers, setLastSixJobOffers] = useState([]);
  const [annualSubscriptionPartners, setAnnualSubscriptionPartners] = useState([]);
  // const [annualReportQualityCandidature, setAnnualReportQualityCandidature] = useState([]);
  const [dates, setDates] = useState([]);
  const [subscriptionWithoutFreemium, setSubscriptionWithoutFreemium] = useState([]);
  const [subscriptionFreemium, setSubscriptionFreemium] = useState([]);
  const [rankingGame, setRankingGame] = useState([]);
  const [newUserAtMoment, setNewUserAtMoment] = useState([]);
  const [totalGame, setTotalGame] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalPartners, setTotalPartners] = useState(0);
  const [totalSubscriptionInPending, setTotalSubscriptionInPending] = useState(0);

  const loadData = useCallback(async () => {
    const info = await ConsumApi.getDashboard();
    if (info.success) {
      const { data } = info;
      setAnnualSubscriptionPartners(data.annualSubscriptionPartners.map((item) => ({
        label: item.name,
        value: item.totalSubscriptionOfYears,
      })));
      // setAnnualReportQualityCandidature(data.annualReportQualityCandidature);
      // setLastSixJobOffers(data.LastSixJobOffers);
      // setLastSixJTrainings(data.LastSixJTrainings);
      setDates(data.dates);
      setSubscriptionWithoutFreemium(data.subscriptionWithoutFreemium);
      setSubscriptionFreemium(data.subscriptionFreemium);
      setNewUserAtMoment(data.newUserAtMoment);
      setTotalGame(data.totalGame);
      setTotalUser(data.totalUser);
      setTotalPartners(data.totalPartners);
      setRankingGame(data.rankingGame.map((item) => ({
        label: item.game.title,
        value: item.sessionCount,
      })));
      setTotalSubscriptionInPending(data.totalSubscriptionInPending);
    } else if (!info.success && info.message && info.message.includes("Session Expiré veuillez vous réconnecter")) {
      router.replace('/login');
    }
    setFetch(false);
  }, [router]);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Statistiques globales
      </Typography>

      {!isFetching && (
      <Grid container spacing={1}>
        <Grid size={{xs:12, sm:6, md:3}}>
          <AppWidgetSummary
            title="Total de films"
            total={totalGame}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <AppWidgetSummary
            title="Total utilisateurs"
            total={totalUser}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag1.png" />}
          />
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <AppWidgetSummary
            title="Partenaires"
            total={totalPartners}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_batiment.png" />}
          />
        </Grid>

        <Grid size={{xs:12, sm:6, md:3}}>
          <AppWidgetSummary
            title="Total souscriptions"
            total={totalSubscriptionInPending}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid size={{xs:12, md:6, lg:8}}>
          <AppWebsiteVisits
            title="Rapport nouveau utilisateurs/abonnement freemium/abonnement convertie sur les 30 derniers jours"
            subheader="il s'agit ici d'un ration entre les nouveaux utilisateurs et les abonnements converties"
            chart={{
              labels: dates.reverse(),
              series: [
                {
                  name: "Nouveaux utilisateurs",
                  type: 'column',
                  fill: 'solid',
                  data: newUserAtMoment.reverse(),
                },
                {
                  name: 'Abonnements freemium',
                  type: 'area',
                  fill: 'gradient',
                  data: subscriptionFreemium.reverse(),
                },
                {
                  name: 'Abonnements converties',
                  type: 'line',
                  fill: 'solid',
                  data: subscriptionWithoutFreemium.reverse(),
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{xs:12, md:6, lg:4}}>
          <AppCurrentVisits
            title="Rapport souscription annuelle par partenaire"
            subheader={`Statistique global sur les souscriptions crées durant ${new Date().getFullYear()}`}
            chart={{
              series: annualSubscriptionPartners,
            }}
          />
        </Grid>

        <Grid size={{xs:12, md:6, lg:8}}>
          <AppConversionRates
            title="Classement des films les plus vues"
            subheader="Vision globale sur les films les plus vues"
            chart={{
              series: rankingGame,
            }}
          />
        </Grid>

        {/* <Grid size={{xs:12, md:6, lg:4}}>
          <AppCurrentVisits
            title="Rapport qualité embauche annuel"
            subheader={`Candidature acceptées/rejetté/en attente pour ${new Date().getFullYear()}`}
            chart={{
              series: annualReportQualityCandidature,
            }}
          />
        </Grid>

        <Grid size={{xs:12, md:6, lg:8}}>
          <AppNewsUpdate
            title="Dernières offres en ligne"
            list={lastSixJobOffers.map((job) => ({
              id: job._id,
              title: job.title,
              description: job.location,
              image: `${apiUrlAsset.logo}/${job.cover}`,
              postedAt: new Date(job.postedAt),
            }))}
          />
        </Grid>

        <Grid size={{xs:12, md:6, lg:4}}>
          <AppOrderTimeline
            title="Dernières formations en ligne"
            list={lastSixJTrainings.map((training, index) => ({
              id: training._id,
              title: training.title,
              type: `order${index + 1}`,
              time: new Date(training.startDate),
            }))}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={6}>
          <AppTrafficBySite
            title="Traffic by Site"
            list={[
              {
                name: 'FaceBook',
                value: 323234,
                icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} />,
              },
              {
                name: 'Google',
                value: 341212,
                icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />,
              },
              {
                name: 'Linkedin',
                value: 411213,
                icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} />,
              },
              {
                name: 'Twitter',
                value: 443232,
                icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />,
              },
            ]}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={6}>
          <AppTasks
            title="Actions rapide vote en ligne"
            list={[
              { id: 1, name: 'Edition Miss 2023', isActive: false },
              { id: 2, name: 'Edition Miss 2022', isActive: true },
              { id: 3, name: 'Edition Miss 2021', isActive: false },
              { id: 4, name: 'Edition Miss 2020', isActive: false },
              { id: 5, name: 'Edition Miss 2019', isActive: false },
            ]}
          />
        </Grid> */}
        {/* <Grid xs={12} md={6} lg={6}>
          <AppTasks
            title="Actions rapide sondage"
            list={[
              { id: 1, name: 'Edition Miss 2023', isActive: false },
              { id: 2, name: 'Edition Miss 2022', isActive: true },
              { id: 3, name: 'Edition Miss 2021', isActive: false },
              { id: 4, name: 'Edition Miss 2020', isActive: false },
              { id: 5, name: 'Edition Miss 2019', isActive: false },
            ]}
          />
        </Grid> */}
      </Grid>
      )
      }
      {isFetching && (
        <Grid container spacing={3}>
          {Array.from(new Array(4)).map((item, index) => (
            <Grid xs={12} key={`skeleton-${index}`} sm={6} md={3}>
              <Skeleton variant="rectangular" width="100%" height={120} />
            </Grid>
          )
          )}

          <Grid size={{xs:12, md:6, lg:8}}>
            <Card sx={{ padding: 1}}>
              <Skeleton width="30%" variant="text" sx={{ fontSize: '1rem' }} />
              <Skeleton width="60%" variant="text" sx={{ fontSize: '1em' }} />
              <Grid container direction="row" justifyContent="flex-end" spacing={1} sx={{pr: 1, mb:3}}>
                {Array.from(new Array(3)).map((item, index) => (
                  <Grid direction="row" key={`skeleton-sondage-${index}`} item xs={2} md={1}>
                    <Skeleton variant="circular" width={10} height={10}  />
                    <Skeleton width="70%" variant="text" sx={{ fontSize: '0.4em' }} />
                  </Grid>
                ))}
              </Grid>
              <Grid container spacing={3}>
                <Skeleton variant="rectangular" width="100%" height={450} animation="pulse" />
              </Grid>
            </Card>
          </Grid>
          <Grid size={{xs:12, md:6, lg:4}}>
            <Card sx={{ padding: 1, height: 540, pt: 4}}>
                <Skeleton width="30%" variant="text" sx={{ fontSize: '1rem' }} />
                
                <Grid container justifyContent="center" alignItems="center" spacing={1} sx={{pt: 10, mb:3}}>
                  <Skeleton variant="circular" width="60%" height={300} />
                </Grid>
                
              </Card>
          </Grid>


          <Grid size={{xs:12, md:6, lg:8}}>
            <Card sx={{ padding: 1}}>
              <Skeleton width="30%" variant="text" sx={{ fontSize: '1rem' }} />
              <Skeleton width="60%" variant="text" sx={{ fontSize: '1em' }} />
              <Grid container spacing={3}>
                <Skeleton variant="rectangular" width="100%" height={450} animation="pulse" />
              </Grid>
            </Card>
          </Grid>
          <Grid size={{xs:12, md:6, lg:4}}>
            <Card sx={{ padding: 1, height: 490, pt: 3}}>
                <Skeleton width="30%" variant="text" sx={{ fontSize: '1rem' }} />
                
                <Grid container justifyContent="center" alignItems="center" spacing={1} sx={{pt: 10, mb:3}}>
                  <Skeleton variant="circular" width="60%" height={300} />
                </Grid>
                
              </Card>
          </Grid>

        </Grid>
      )
      }
    </Container>
  );
}
