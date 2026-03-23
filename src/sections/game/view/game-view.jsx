import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Flex, Space, Table, Upload, message, Dropdown} from 'antd'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import { red  } from '@mui/material/colors';
import Skeleton from '@mui/material/Skeleton';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import RadioGroup from '@mui/material/RadioGroup';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import FormHelperText from '@mui/material/FormHelperText';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FormControlLabel from '@mui/material/FormControlLabel';
import DialogContentText from '@mui/material/DialogContentText';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';

import { useRouter } from 'src/routes/hooks';

import { usemoovies, useCreateGame, useUpdateGame, useCategoriesmoovies , useCreateCategorymoovies } from 'src/hooks/use-games';

import { getSrcFromFile, onPreviewCompetitionCover } from 'src/utils/traitement-file';

import { RoleEnum } from 'src/enum/RoleEnum';
import {apiUrlAsset} from 'src/constants/apiUrl';
import { useAdminStore } from 'src/store/useAdminStore';

import Iconify from 'src/components/iconify';

import PostCard from '../post-card';
// import PostSort from '../post-sort';
// import PostSearch from '../post-search';
// ----------------------------------------------------------------------

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function GameView() {
  const router = useRouter();
  const theme = useTheme();
  const { admin } = useAdminStore();
  const canCreateCategory = admin?.role !== RoleEnum.ADMIN_PRODUCTION;
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [fileList, setFileList] = useState([]);
  const [fileListProfil, setFileListProfil] = useState([]);
  const [nameCovers, changeNameCovers] = useState([]);
  const [nameProfil, changeNameProfil] = useState([]);
  const [categorieGameChoice, changeCategorieGameChoice] = useState([]);
  const [base64Files, changeBase64Files] = useState([]);
  const [base64Profil, changeBase64Profil] = useState([]);
  const [openCreateGame, setOpenCreateGame] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [detailEpisodes, setDetailEpisodes] = useState([]);
  const [detailTitle, setDetailTitle] = useState('');
  const [detailDescription, setDetailDescription] = useState('');
  const [detailTrailler, setDetailTrailler] = useState('');
  const [detailCategoryIds, setDetailCategoryIds] = useState([]);
  const [title, changeTitle] = useState('');
  const [nameCategory, changeNameCategory] = useState('');
  const [trailler, changeTrailler] = useState('');
  const [priceEpisode, changePriceEpisode] = useState('25');
  const [description, changeDescription] = useState('');
  const [episodes, changeEpisodes] = useState([]);
  const { data: categories, isLoading:isLoadingCategory, isError: isErrorCategoryGame, error: errorCategoryGame, refetch: refetchCategoryGame} = useCategoriesmoovies();
  const queryClient = useQueryClient();
  const { data: moovies, isLoading:isLoadingGame, isError: isErrorGame, error: errorGame, refetch: refetchGame} = usemoovies();
  
  const { mutate: createGameMutation, isLoading: isCreatingGame } = useCreateGame();
  const { mutate: updateGameMutation, isLoading: isUpdatingGame } = useUpdateGame();
  const { mutate: createCategoryGameMutation, isLoading: isCreatingCategory } = useCreateCategorymoovies();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router]);

  const handleToogleDialogCreatemoovies = () => {
    setOpenCreateGame((prev) => !prev);
  };

  const openFilmDetail = (game) => {
    setSelectedFilm(game);
    const eps = (game.episodes && Array.isArray(game.episodes))
      ? game.episodes.map((e) => ({
          id: e.id,
          moovie_id: e.moovie_id ?? null,
          url: e.url || '',
          isPublic: e.isPublic ?? false,
        }))
      : [];
    setDetailEpisodes(eps);
    setDetailTitle(game.title || '');
    setDetailDescription(game.description || '');
    setDetailTrailler(game.trailler || '');
    setDetailCategoryIds((game.categories && Array.isArray(game.categories)) ? game.categories.map((c) => c.id).filter(Boolean) : []);
    setOpenDetailModal(true);
  };

  const closeFilmDetail = () => {
    setOpenDetailModal(false);
    setSelectedFilm(null);
    setDetailEpisodes([]);
    setDetailTitle('');
    setDetailDescription('');
    setDetailTrailler('');
    setDetailCategoryIds([]);
  };

  const saveFilmDetail = () => {
    if (!selectedFilm?.id) return;
    messageApi.loading('Enregistrement...');
    // Body conforme à l'API PUT : on envoie toujours title et description (valeurs du formulaire) pour que la mise à jour soit bien prise en compte
    const eps = detailEpisodes.map((e) => {
      const ep = {
        moovie_id: e.moovie_id || '',
        url: (e.url || '').trim(),
        isPublic: Boolean(e.isPublic),
      };
      if (e.id) ep.episode_id = e.id;
      return ep;
    });
    const body = {
      title: detailTitle.trim(),
      description: detailDescription.trim(),
      categories: detailCategoryIds.filter(Boolean),
      episodes: eps,
    };
    updateGameMutation(
      { id: selectedFilm.id, ...body },
      {
        onSuccess: async () => {
          closeFilmDetail();
          queryClient.invalidateQueries({ queryKey: ['moovies'] });
          await refetchGame();
          messageApi.destroy();
          messageApi.success('Film mis à jour avec succès.');
        },
        onError: (e) => {
          messageApi.destroy();
          messageApi.error(e.message);
        },
      }
    );
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''),
      render: (_, record) => record.title || record.name || '',
    },
    {
      title: 'Date de création',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0),
      render: (created_at) => created_at ? new Date(created_at).toLocaleDateString('fr-FR') : '-',
    },
    {
      title: 'Date de modification',
      dataIndex: 'updated_at',
      key: 'updated_at',
      sorter: (a, b) => new Date(a.updated_at || 0) - new Date(b.updated_at || 0),
      render: (updated_at) => updated_at ? new Date(updated_at).toLocaleDateString('fr-FR') : '-',
    },
    {
      title: 'Action',
      key: 'id',
      render: (_, {id}) => (
        <Space size="middle">
            <Dropdown menu={{ items: menuItems(id) }} trigger={['click']}>
              <span
                role="button"
                style={{cursor: 'pointer'}}
                tabIndex={0}
                onClick={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                  }
                }}
              >
                <MoreHorizIcon />
              </span>
            </Dropdown>

        </Space>
      ),
    },
  ];

  const menuItems = (id) => [
    {
      key: `removeItem${id}`,
      label: (
        <Flex gap='middle' align='center' justify='space-between'>
          Supprimer <DeleteTwoToneIcon sx={{color: red[500]}}/>
        </Flex>
      ),
      onClick: () => console.log(id),
      className: 'hover-danger',
    },
  ]

  const createmoovies = async () => {
    const categoriesFilter = categorieGameChoice.map(category => {
      const categoryFound = (categories && Array.isArray(categories)) ? categories.find(cat => cat.title === category || cat.name === category) : null;
      return categoryFound ? categoryFound.id : null;
    }).filter(id => id !== null);
    const isReady = [title.trim(), description.trim()].filter(verification => verification.length < 3).length === 0
    if (isReady && fileList.length > 0 && fileListProfil.length > 0 && categoriesFilter.length > 0 && episodes.length > 0) {
      const covers = nameCovers.map((fileName, index) => ({
          fileName,
          base64: base64Files[index],
        }))
        messageApi.loading("Création en cours");
        createGameMutation(
          {
            nameProfil: nameProfil[0],
            base64Profil: base64Profil[0],
            title,
            description,
            trailler,
            covers,
            episodes: episodes.map(({moovie_id, url, isPublic}) => ({
              moovie_id: moovie_id || null,
              url: url || '',
              isPublic: isPublic || false
            })),
            priceEpisode: parseInt(priceEpisode, 10) || 25,
            categories: categoriesFilter,
          }, {
            onSuccess: async () => {
              handleToogleDialogCreatemoovies();
              setFileList([]);
              changeBase64Files([]);
              changeNameCovers([]);
              changeDescription('');
              changeTitle('');
              changeTrailler('');
              changePriceEpisode('25');
              changeEpisodes([]);
              await refetch();
              messageApi.destroy();
              messageApi.success("Film créé avec succès !");
            },
            onError: (e) => {
              messageApi.destroy();
              messageApi.error(e.message);
            }
          }
        );
        
      } else {
        messageApi.error("Veuillez renseigner les informations correctement (titre, description, poster, couvertures, catégories et au moins un épisode)");
      }
  }
  const createCategorymoovies = async () => {
    const isReady = [nameCategory.trim()].filter(verification => verification.length < 3).length === 0;
    if (isReady) {
        messageApi.loading("Création en cours");
        createCategoryGameMutation(
          {
            name: nameCategory.trim()
          }, {
            onSuccess: async () => {
              changeNameCategory('');
              await refetch();
              messageApi.destroy();
              messageApi.success("Catégorie créé avec succès !");
            },
            onError: (e) => {
              messageApi.destroy();
              messageApi.error(e.message);
            }
          }
        );
        
      } else {
        messageApi.error("Veuillez renseigner le nom de la catégorie");
      }
  }
  
  const onChangePictureCover = async ({ fileList: newFileList }) => {
  setFileList(newFileList);
  if (newFileList.length > 0) {
    const nameFile = newFileList.map(file => `${file.uid}.${file.type.split('/')[1]}`);
    changeNameCovers(nameFile); // <-- Mise à jour des noms

    const promises = newFileList.map(file => getSrcFromFile(file));
    const base64Results = await Promise.all(promises);
    changeBase64Files(base64Results); // <-- Mise à jour des fichiers encodés
  }
  };
  const onChangePictureProfil = async ({ fileList: newFileListProfil }) => {
  setFileListProfil(newFileListProfil);
  if (newFileListProfil.length > 0) {
    const nameFile = newFileListProfil.map(file => `${file.uid}.${file.type.split('/')[1]}`);
    changeNameProfil(nameFile); // <-- Mise à jour des noms

    const promises = newFileListProfil.map(file => getSrcFromFile(file));
    const base64Results = await Promise.all(promises);
    changeBase64Profil(base64Results); // <-- Mise à jour des fichiers encodés
  }
  };


  const handleChangeCategorieChoice = event => {
    const {
      target: { value },
    } = event;
    changeCategorieGameChoice(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
};
  
  const refetch = async () => {
    await refetchCategoryGame();
    await refetchGame();
  }

  if (isErrorGame) {
    console.error("Erreur lors de la récupération des film :", errorGame.message);
  }

  if (isErrorCategoryGame) {
    console.error("Erreur lors de la récupération des catégories film :", errorCategoryGame.message);
  }

  return (
    <Container maxWidth='xl'>
      {contextMessageHolder}
      {canCreateCategory && (
      <Box sx={{width: '100%'}}>
        <Typography variant="h4">Gestions Cartegorie Films</Typography>
        <Typography variant="subtitle1">Créer une nouvelle cartegorie de film</Typography>
        <Grid container spacing={3} sx={{ my: 2 }} >
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <TextField
                      value={nameCategory}
                      onChange={(event) => changeNameCategory(event.target.value)}
                      fullWidth
                    label="Nom de la categorie du film"
                    required
                    name="nameCategory" />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <Button variant="contained" disabled={isCreatingCategory} color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={createCategorymoovies}
              >
              Enregistrer cette catégorie
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ my: 2 }}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}  >
            <Table
              pagination={{pageSize: 4}}
                        dataSource={categories && Array.isArray(categories) ? categories.map((cat, index) => ({ ...cat, key: cat.id || `category-${index}` })) : []}
                        columns={columns}
                        rowKey={(record) => record.id || record.key}
                      />
            </Grid>
        </Grid>
      </Box>
      )}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Gestions Films</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={handleToogleDialogCreatemoovies}
        >
          Ajouter un film
        </Button>
      </Stack>

      {/* <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
        <PostSearch posts={posts} />
        <PostSort
          options={[
            { value: 'latest', label: 'Recent' },
            { value: 'popular', label: 'Populaire' },
            { value: 'oldest', label: 'Ancien' },
          ]}
        />
      </Stack> */}

      <Grid container spacing={3}>
        {isLoadingGame && (Array.from(new Array(9))).map((item, index) => (
          <Grid key={`skeleton-${index}`} size={{xs: 12, sm: 4, md: 3}}>
            <Card sx={{width: '100%', height: 400, marginBottom: 2}} >
              <Skeleton variant="rectangular" width="100%" height="100%" animation="pulse" />
            </Card>
          </Grid>
        ))}
        {!isLoadingGame && isErrorGame && (
          <Grid size={{xs: 12}}>
            <Box sx={{width: '100%', textAlign: 'center', mt: 5}}>
              <Typography variant="h5" color="error">
                Erreur lors du chargement des film
              </Typography>
              <Typography variant="body1" sx={{mt: 2}}>
                {errorGame?.message || "Une erreur s'est produite"}
              </Typography>
            </Box>
          </Grid>
        )}
        {!isLoadingGame && !isErrorGame && ((moovies && Array.isArray(moovies) && moovies.length > 0) ? moovies.map((game) => (
            <PostCard key={game.id} game={game} onFilmClick={openFilmDetail} />
          )) : (
            <Grid size={{xs: 12}}>
              <Box sx={{width: '100%', textAlign: 'center', mt: 5}}>
                <Typography variant="body1">
                  Aucun jeu disponible
                </Typography>
              </Box>
            </Grid>
          ))}
      </Grid>
      <Dialog maxWidth="xl" fullWidth disableEscapeKeyDown open={openCreateGame} onClose={handleToogleDialogCreatemoovies}>
            <DialogTitle>
              Nouveau film
            </DialogTitle>

            <DialogContent>
              
              <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <DialogContentText sx={{ mb: 3 }}>
                Veuillez sélectionner les catégories du film
              </DialogContentText>
              <Box component='div' sx={{ width: '80%' }}>
                  {!isLoadingCategory && <FormControl sx={{ m: 1, width: '100%' }}>
                    <InputLabel id="demo-simple-select-helper-label">Catégorie</InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      placeholder="Action, Aventure, Arcade, etc..."
                      value={categorieGameChoice}
                      onChange={handleChangeCategorieChoice}
                      input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                      renderValue={(categoriesChoice) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {categoriesChoice.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {(categories && Array.isArray(categories)) ? categories.map((category) => {
                        const categoryTitle = category.title || category.name || '';
                        return (
                        <MenuItem
                          key={category.id}
                          value={categoryTitle}
                          style={getStyles(categoryTitle, categorieGameChoice, theme)}
                        >
                          {categoryTitle}
                        </MenuItem>
                      );
                      }) : null}
                    </Select>
                    <FormHelperText>Vous pouvez en choisir plusieurs</FormHelperText>
                  </FormControl>}
                    
              </Box>
              <DialogContentText sx={{ my: 3 }}>
                Poster
              </DialogContentText>
                  <Box component='div' sx={{ width: '100%' }}>
                    <Upload
                      listType="picture-card"
                      accept='image/png, image/jpeg, image/webp'
                      fileList={fileListProfil}
                      beforeUpload={() => false}
                      onChange={onChangePictureProfil}
                      onPreview={onPreviewCompetitionCover}
                      >
                            {fileListProfil.length < 1 && (
                            <Box component='div' sx={{width: 200, border: 'dashed #e0e0e0', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection:'column', padding: 2, cursor: 'pointer'}}>
                                <Iconify icon="openmoji:picture" />
                              <span className="ant-upload-text">Charger le poster ici</span>
                              
                            </Box>
                            )
                      }
                      </Upload>
              </Box>
              
              <DialogContentText sx={{ my: 3 }}>
                Les photos de couvertures
              </DialogContentText>
                  <Box component='div' sx={{ width: '100%' }}>
                    <Upload
                      listType="picture"
                      accept='image/png, image/jpeg, image/webp'
                      fileList={fileList}
                  multiple
                  maxCount={6}
                      beforeUpload={() => false}
                      onChange={onChangePictureCover}
                      onPreview={onPreviewCompetitionCover}
                      >
                            {fileList.length < 6 && (
                            <Box component='div' sx={{width: 200, border: 'dashed #e0e0e0', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection:'column', padding: 2, cursor: 'pointer'}}>
                                <Iconify icon="openmoji:picture" />
                              <span className="ant-upload-text">Charger les images</span>
                              
                            </Box>
                            )
                      }
                      </Upload>
                  </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 12, md: 12 }} marginTop={1}>
                    <TextField
                      value={title}
                      onChange={(event) => changeTitle(event.target.value)}
                      fullWidth
                    label="Titre du film"
                    required
                    name="title" />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12 }} marginTop={1}>
                    <TextField
                      value={trailler}
                      onChange={(event) => changeTrailler(event.target.value)}
                    fullWidth
                    placeholder='https://www.youtube.com/watch?v=riCP9x31Kuk'
                      label="Trailer"
                    name="trailler" />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12 }} marginTop={1}>
                    <TextField
                      value={priceEpisode}
                      onChange={(event) => changePriceEpisode(event.target.value)}
                    fullWidth
                    type="number"
                    placeholder='25'
                    label="Prix de l'épisode"
                    disabled
                    name="priceEpisode" />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12 }} marginTop={1}>
                    <TextField
                      value={description}
                      onChange={(e) => changeDescription(e.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                      label="Description"
                      name="description"
                      required
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Section Épisodes */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12 }}>
                <DialogContentText sx={{ mb: 2 }}>
                  Épisodes
                </DialogContentText>
              </Grid>
              {episodes.map((episode, index) => (
                <Grid container spacing={2} sx={{ mt: 1 }} key={`episode-${index}`}>
                  <Grid size={{ xs: 12, sm: 9, md: 10 }}>
                    <TextField
                      value={episode.url || ''}
                      onChange={(event) => changeEpisodes(
                        (oldEpisodes) => 
                          oldEpisodes.map((oldEpisode, idx) => {
                            if(idx === index) {
                              return {
                                ...oldEpisode,
                                url: event.target.value,
                              }
                            }
                            return oldEpisode;
                          })
                      )}
                      fullWidth
                      label="URL de l'épisode"
                      placeholder="https://example.com/episode-1"
                      name={`episode-url-${index}`}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 2, md: 1 }}>
                    <FormLabel id={`episode-public-${index}`}>Public</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby={`episode-public-${index}`}
                      name={`episode-public-${index}`}
                      value={episode.isPublic ? 'oui' : 'non'}
                      onChange={(event) => changeEpisodes(
                        (oldEpisodes) => 
                          oldEpisodes.map((oldEpisode, idx) => {
                            if(idx === index) {
                              return {
                                ...oldEpisode,
                                isPublic: event.target.value === 'oui',
                              }
                            }
                            return oldEpisode;
                          })
                      )}
                    >
                      <FormControlLabel value="oui" control={<Radio />} label="Oui" />
                      <FormControlLabel value="non" control={<Radio />} label="Non" />
                    </RadioGroup>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 1, md: 1 }}>
                    <IconButton color="secondary" aria-label="supprimer épisode" onClick={() => changeEpisodes(
                      (oldEpisodes) => 
                        oldEpisodes.filter((_, idx) => idx !== index)
                    )}>
                      <DeleteTwoToneIcon color='danger' />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Grid size={{ xs: 12 }}>
                <Stack mt={2} direction='row' alignItems='center' justifyContent='center'>
                  <Button variant='outlined' onClick={() => changeEpisodes((oldEpisodes) => ([...oldEpisodes, { moovie_id: null, url: '', isPublic: false }] ))} endIcon={<AddCircleTwoToneIcon />}>Ajouter un épisode</Button>
                </Stack>
              </Grid>
            </Grid>

                

              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleToogleDialogCreatemoovies}>Annuler</Button>
              <Button variant="contained" onClick={createmoovies} disabled={isCreatingGame} startIcon={isCreatingGame && <AutorenewIcon />} >{isCreatingGame ? "Enregistrement": 'Enregistrer'}</Button>
            </DialogActions>
          </Dialog>

      {/* Modal détail film + édition (tout sauf prix et photo) */}
      <Dialog maxWidth="md" fullWidth open={openDetailModal} onClose={closeFilmDetail}>
        <DialogTitle>Détails du film</DialogTitle>
        <DialogContent>
          {selectedFilm && (
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                {selectedFilm.poster && (
                  <>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>Photo (non modifiable)</Typography>
                    <Box
                      component="img"
                      alt={selectedFilm.title}
                      src={`${apiUrlAsset.moovies}/${selectedFilm.poster}`}
                      sx={{ width: '100%', borderRadius: 1, objectFit: 'cover' }}
                    />
                  </>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                <TextField
                  fullWidth
                  label="Titre"
                  value={detailTitle}
                  onChange={(e) => setDetailTitle(e.target.value)}
                  sx={{ mb: 1.5 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={detailDescription}
                  onChange={(e) => setDetailDescription(e.target.value)}
                  sx={{ mb: 1.5 }}
                />
                <TextField
                  fullWidth
                  label="Trailer (URL)"
                  value={detailTrailler}
                  onChange={(e) => setDetailTrailler(e.target.value)}
                  placeholder="https://..."
                  sx={{ mb: 1.5 }}
                />
                {!isLoadingCategory && (
                  <FormControl fullWidth sx={{ mb: 1.5 }}>
                    <InputLabel id="detail-categories-label">Catégories</InputLabel>
                    <Select
                      labelId="detail-categories-label"
                      multiple
                      value={detailCategoryIds}
                      onChange={(e) => setDetailCategoryIds(e.target.value)}
                      input={<OutlinedInput label="Catégories" />}
                      renderValue={(ids) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {ids.map((id) => {
                            const cat = (categories || []).find((c) => c.id === id);
                            return <Chip key={id} label={cat?.title || cat?.name || id} size="small" />;
                          })}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {(categories && Array.isArray(categories)) ? categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.title || cat.name}
                        </MenuItem>
                      )) : null}
                    </Select>
                  </FormControl>
                )}
                <Typography variant="body2" color="text.secondary">
                  Prix / épisode : {selectedFilm.priceEpisode != null ? `${selectedFilm.priceEpisode} FCFA` : '-'} (non modifiable)
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <DialogContentText sx={{ mt: 2, mb: 1 }}>Épisodes</DialogContentText>
                {detailEpisodes.map((episode, index) => (
                  <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }} key={`detail-ep-${index}`}>
                    <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                      <TextField
                        value={episode.url || ''}
                        onChange={(e) => setDetailEpisodes((prev) => prev.map((ep, i) => (i === index ? { ...ep, url: e.target.value } : ep)))}
                        fullWidth
                        size="small"
                        label="URL de l'épisode"
                        placeholder="https://..."
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2, md: 2 }}>
                      <FormLabel>Public</FormLabel>
                      <RadioGroup
                        row
                        value={episode.isPublic ? 'oui' : 'non'}
                        onChange={(e) => setDetailEpisodes((prev) => prev.map((ep, i) => (i === index ? { ...ep, isPublic: e.target.value === 'oui' } : ep)))}
                      >
                        <FormControlLabel value="oui" control={<Radio size="small" />} label="Oui" />
                        <FormControlLabel value="non" control={<Radio size="small" />} label="Non" />
                      </RadioGroup>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 1, md: 1 }}>
                      <IconButton color="error" size="small" onClick={() => setDetailEpisodes((prev) => prev.filter((_, i) => i !== index))}>
                        <DeleteTwoToneIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddCircleTwoToneIcon />}
                  onClick={() => setDetailEpisodes((prev) => [...prev, { moovie_id: null, url: '', isPublic: false }])}
                  sx={{ mt: 1 }}
                >
                  Ajouter un épisode
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFilmDetail}>Fermer</Button>
          <Button variant="contained" onClick={saveFilmDetail} disabled={isUpdatingGame} startIcon={isUpdatingGame && <AutorenewIcon />}>
            {isUpdatingGame ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
