function imageCarousel(
  imgSrcs,
  { width = '70vw', height = '60vh', parentElement = document.body } = {}
) {
  const carousel = document.createElement('div');
  carousel.classList.add('carousel');
  parentElement.append(carousel);

  const imgContainer = document.createElement('div');
  imgContainer.setAttribute('style', `width: ${width}; height: ${height};`);
  imgContainer.classList.add('carousel-image-container');
  carousel.append(imgContainer);

  const imgs = imgSrcs.map((imgSrc, i) => {
    const img = new Image();
    img.src = imgSrc;
    img.style.setProperty('max-width', width);
    img.style.setProperty('max-height', height);
    img.dataset.index = i;
    img.classList.add('carousel-image');
    imgContainer.append(img);
    return img;
  });

  // Make carousel long enough that at least one image is hidden off-stage so the carousel can 'spin'
  /*
  while (imgs.length < 3) {
    const oldLength = imgs.length;
    imgs.push(
      ...imgs.map((img, i) => {
        const imgCopy = img.cloneNode();
        imgCopy.dataset.index = oldLength + i;
        imgContainer.append(imgCopy);
        return imgCopy;
      })
    );
  }
  */

  const indexMarkerContainer = document.createElement('div');
  indexMarkerContainer.classList.add('carousel-index-markers');
  carousel.append(indexMarkerContainer);

  const indexMarkers = imgs.map((img) => {
    const indexMarker = document.createElement('span');
    indexMarker.classList.add('carousel-index-marker');
    indexMarker.dataset.index = img.dataset.index;
    indexMarker.textContent = '◯';
    indexMarkerContainer.append(indexMarker);
    return indexMarker;
  });

  let currImgIndex = imgs.length - 1;
  function changeImage(nextImgIndex) {
    imgs.forEach((img) => {
      img.classList.add('hidden');
      img.classList.add('off-stage');

      const index = Number(img.dataset.index);
      const isFirstAndFollowing =
        nextImgIndex === imgs.length - 1 && index === 0;
      const isLastAndFollowing =
        nextImgIndex === 0 && index === imgs.length - 1;

      if ((!isFirstAndFollowing && index < nextImgIndex) || isLastAndFollowing)
        img.style.setProperty(
          'transform',
          `translateX(calc((${width} + 1px) * -1))`
        );

      if ((!isLastAndFollowing && index > nextImgIndex) || isFirstAndFollowing)
        img.style.setProperty(
          'transform',
          `translateX(calc((${width} + 1px)))`
        );

      if ([currImgIndex, nextImgIndex].includes(index))
        img.classList.remove('hidden');
      if (index === nextImgIndex) {
        img.classList.remove('off-stage');
        img.style.setProperty('transform', 'none');
      }
    });

    indexMarkers.forEach((indexMarker) => {
      indexMarker.textContent = '◯';
      const index = Number(indexMarker.dataset.index);
      if (index === nextImgIndex) indexMarker.textContent = '⬤';
    });

    currImgIndex = nextImgIndex;
  }
  changeImage(0);

  function nextImage() {
    changeImage((currImgIndex + 1) % imgs.length);
  }

  function prevImage() {
    changeImage((currImgIndex - 1 + imgs.length) % imgs.length);
  }

  const prevArrow = document.createElement('div');
  prevArrow.classList.add('carousel-arrow');
  prevArrow.textContent = '<';
  prevArrow.addEventListener('click', prevImage);
  imgContainer.insertAdjacentElement('beforebegin', prevArrow);

  const nextArrow = document.createElement('div');
  nextArrow.classList.add('carousel-arrow');
  nextArrow.textContent = '>';
  nextArrow.addEventListener('click', nextImage);
  imgContainer.insertAdjacentElement('afterend', nextArrow);

  indexMarkers.forEach((indexMarker) => {
    indexMarker.addEventListener('click', () =>
      changeImage(Number(indexMarker.dataset.index))
    );
  });

  setInterval(nextImage, 5000);
}
