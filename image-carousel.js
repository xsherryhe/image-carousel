export default function imageCarousel(
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

  function forwardImage() {
    changeImage((currImgIndex + 1) % imgs.length);
  }

  function backImage() {
    changeImage((currImgIndex - 1 + imgs.length) % imgs.length);
  }

  const backArrow = document.createElement('div');
  backArrow.classList.add('carousel-arrow');
  backArrow.textContent = '<';
  backArrow.addEventListener('click', backImage);
  imgContainer.insertAdjacentElement('beforebegin', backArrow);

  const forwardArrow = document.createElement('div');
  forwardArrow.classList.add('carousel-arrow');
  forwardArrow.textContent = '>';
  forwardArrow.addEventListener('click', forwardImage);
  imgContainer.insertAdjacentElement('afterend', forwardArrow);

  indexMarkers.forEach((indexMarker) => {
    indexMarker.addEventListener('click', () =>
      changeImage(Number(indexMarker.dataset.index))
    );
  });

  setInterval(forwardImage, 5000);
}
