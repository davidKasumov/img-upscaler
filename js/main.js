const createImage = file => {
  const img = new Image()
  img.src = URL.createObjectURL(file)
  img.title = file.name

  return img
}

const upload = (input, resultSelector, listSelector) => {
  const result = document.querySelector(resultSelector)
  const list = document.querySelector(listSelector)
  result.classList.add('active')

  Object.entries(input.files).forEach(el => {
    const str = `<b>${el[1].name}</b>, size: ${(el[1].size / 1e6).toFixed(2)}MB`
    result.innerHTML = result.innerHTML + `<p>${str}</p>`

    list.appendChild(createImage(el[1]))
  })
}

const clearInput = (
  inputSelector,
  resultSelector,
  listSelector,
  gallerySelector
) => {
  const input = document.querySelector(inputSelector)
  const result = document.querySelector(resultSelector)
  const list = document.querySelector(listSelector)
  const gallery = document.querySelector(gallerySelector)

  input.type = 'text'
  input.type = 'input'
  result.classList.remove('active')
  result.innerHTML = list.innerHTML = gallery.innerHTML = ''
}

const increase = input => {
  const value = input.value

  if (!value || value > 15 || typeof +value !== 'number') {
    input.value = 2
    return
  }
}

const upscale = async (
  btn,
  increaseSelector,
  canvasSelector,
  listSelector,
  gallerySelector
) => {
  const increase = document.querySelector(increaseSelector)
  const images = document.querySelectorAll(listSelector + ' img')
  const canvas = document.querySelector(canvasSelector)
  const ctx = canvas.getContext('2d')
  const gallery = document.querySelector(gallerySelector)
  const loading = document.querySelector('.loading')

  btn.disabled = true
  loading.classList.add('active')
  gallery.innerHTML = ''

  await images.forEach(el => {
    drawImageActualSize(el, canvas, ctx, increase.value)
    const dataUrl = canvas.toDataURL()
    gallery.innerHTML = gallery.innerHTML + drawGallery(dataUrl, el)
  })

  btn.disabled = false
  loading.classList.remove('active')
}

const drawImageActualSize = (img, canvas, ctx, increase) => {
  canvas.width = img.naturalWidth * +increase
  canvas.height = img.naturalHeight * +increase

  ctx.drawImage(img, 0, 0)
  ctx.drawImage(img, 0, 0, img.width * +increase, img.height * +increase)
}

const drawGallery = (dataUrl, img) => {
  const size = encodeURI(dataUrl).split(/%..|./).length - 1

  return `<div class="gallery__container">
            <img src="${dataUrl}" title="${img.title}" alt=""/>
            <div>
              <p>Size: ${(size / 1e6).toFixed(2)}MB</p>
              <a href="${dataUrl}" download="${img.title}">Download</a>
            </div>
          </div>`
}
