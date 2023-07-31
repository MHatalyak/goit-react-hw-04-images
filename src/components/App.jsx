import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Loader from './Loader';
import Button from './Button';
import Modal from './Modal';

const API_KEY = '30554094-a84a8756902b4f7be7a5ac4d7';
const BASE_URL = 'https://pixabay.com/api/';

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImage, setLargeImage] = useState('');

  const fetchImages = useCallback(() => {
    const url = `${BASE_URL}?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;
    setIsLoading(true);

    axios
      .get(url)
      .then(response => {
        setImages(prevImages => [...prevImages, ...response.data.hits]);
        setIsLoading(false);
      })
      .catch(error => {
        console.log('Error fetching images:', error);
        setIsLoading(false);
      });
  }, [query, page]);

  useEffect(() => {
    if (query !== '') {
      setImages([]);
      setPage(1);
    }
  }, [query]);

  useEffect(() => {
    if (query !== '') {
      fetchImages();
    }
  }, [query, page, fetchImages]);

  const handleSearchbarSubmit = newQuery => {
    setQuery(newQuery);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleImageClick = largeImageURL => {
    setLargeImage(largeImageURL);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLargeImage('');
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSearchbarSubmit} />
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {isLoading && <Loader />}
      {images.length > 0 && !isLoading && <Button onClick={handleLoadMore} />}
      {showModal && (
        <Modal largeImage={largeImage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
