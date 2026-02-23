import { useState, useEffect } from 'react';
import { Flex, Image, Space, Table, Upload, message, Checkbox, Dropdown} from 'antd'

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import { red  } from '@mui/material/colors';
import Skeleton from '@mui/material/Skeleton';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FormHelperText from '@mui/material/FormHelperText';
import DialogContentText from '@mui/material/DialogContentText';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';

import { usemoovies, useCreateGame,useCategoriesmoovies , useCreateCategorymoovies } from 'src/hooks/use-games';

import { getSrcFromFile, onPreviewCompetitionCover } from 'src/utils/traitement-file';

import {apiUrlAsset} from 'src/constants/apiUrl';

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
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [fileList, setFileList] = useState([]);
  const [fileListProfil, setFileListProfil] = useState([]);
  const [nameCovers, changeNameCovers] = useState([]);
  const [nameProfil, changeNameProfil] = useState([]);
  const [categorieGameChoice, changeCategorieGameChoice] = useState([]);
  const [base64Files, changeBase64Files] = useState([]);
  const [base64Profil, changeBase64Profil] = useState([]);
  const [openCreateGame, setOpenCreateGame] = useState(false);
  const [title, changeTitle] = useState('');
  const [nameCategory, changeNameCategory] = useState('');
  const [trailler, changeTrailler] = useState('');
  const [priceEpisode, changePriceEpisode] = useState('25');
  const [description, changeDescription] = useState('');
  const [episodes, changeEpisodes] = useState([]);
  const { data: categories, isLoading:isLoadingCategory, isError: isErrorCategoryGame, error: errorCategoryGame, refetch: refetchCategoryGame} = useCategoriesmoovies();
  const { data: moovies, isLoading:isLoadingGame, isError: isErrorGame, error: errorGame, refetch: refetchGame} = usemoovies();
  
  const { mutate: createGameMutation, isLoading: isCreatingGame } = useCreateGame();
  const { mutate: createCategoryGameMutation, isLoading: isCreatingCategory } = useCreateCategorymoovies();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router]);

  const handleToogleDialogCreatemoovies = () => {
    setOpenCreateGame((prev) => !prev);
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
    console.error("Erreur lors de la récupération des jeux :", errorGame.message);
  }

  if (isErrorCategoryGame) {
    console.error("Erreur lors de la récupération des catégories jeux :", errorCategoryGame.message);
  }

  return (
    <Container maxWidth='xl'>
      {contextMessageHolder}
      <Box sx={{width: '100%'}}>
        <Typography variant="h4">Gestions Cartegorie Jeux</Typography>
        <Typography variant="subtitle1">Créer une nouvelle cartegorie de jeux</Typography>
        <Grid container spacing={3} sx={{ my: 2 }} >
          <Grid size={{ xs: 6, sm: 4, md: 3 }}>
            <TextField
                      value={nameCategory}
                      onChange={(event) => changeNameCategory(event.target.value)}
                      fullWidth
                    label="Nom de la categorie du jeu"
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Gestions Jeux</Typography>

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
        {
        isLoadingGame ?
        (Array.from(new Array(9))).map((item, index) => (
          <Grid key={`skeleton-${index}`} size={{xs: 12, sm: 4, md: 3}}>
            <Card sx={{width: '100%', height: 400, marginBottom: 2}} >
              <Skeleton variant="rectangular" width="100%" height="100%" animation="pulse" />
            </Card>
          </Grid>
        ))
        :
        isErrorGame ? (
          <Grid size={{xs: 12}}>
            <Box sx={{width: '100%', textAlign: 'center', mt: 5}}>
              <Typography variant="h5" color="error">
                Erreur lors du chargement des jeux
              </Typography>
              <Typography variant="body1" sx={{mt: 2}}>
                {errorGame?.message || "Une erreur s'est produite"}
              </Typography>
            </Box>
          </Grid>
        ) : (
          (moovies && Array.isArray(moovies) && moovies.length > 0) ? moovies.map((game, index) => (
            <PostCard key={game.id} game={game} index={index} />
          )) : (
            <Grid size={{xs: 12}}>
              <Box sx={{width: '100%', textAlign: 'center', mt: 5}}>
                <Typography variant="body1">
                  Aucun jeu disponible
                </Typography>
              </Box>
            </Grid>
          )
        )
        }
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
    </Container>
  );
}
