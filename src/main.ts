import "./style.css";
import { createClient } from "pexels";

const apiKey = import.meta.env.VITE_PIXELS_API_KEY;

const client = createClient(apiKey);

interface ISlider {
  root?: HTMLElement | null;
  width?: number | string;
  height?: number | string;
}

class Slider {
  root: HTMLElement = document.body;
  wrap: HTMLElement | null = null;
  width: string | number;
  height: string | number;
  imgWrapper: HTMLElement | null = null;
  leftBtn: HTMLElement | null = null;
  rightBtn: HTMLElement | null = null;
  currentImg: HTMLImageElement | null = null;
  count: number = 26;
  images: string[] = [];
  currentImgIndex: number = 0;

  constructor({ root, width = 400, height = 300 }: ISlider) {
    if (root) {
      this.root = root;
    }

    this.width = width;
    this.height = height;

    this.init();
  }

  init() {
    this.initWrapper();

    this.preloadImages().then(() => {
      this.initImage();
      this.initNav();
      this.wrap?.classList.remove("wrapper_loading");
    });
  }

  initWrapper() {
    this.wrap = document.createElement("div");

    const { width, height, wrap } = this;

    wrap.classList.add("wrapper", "wrapper_loading");
    wrap.style.width = typeof width === "number" ? `${width}px` : width;
    wrap.style.height = typeof height === "number" ? `${height}px` : height;

    this.root.append(this.wrap);
  }

  initImage() {
    this.imgWrapper = document.createElement("div");
    this.imgWrapper.classList.add("imageWrapper");
    this.setImage(0);
    this.wrap?.append(this.imgWrapper);
  }

  initNav() {
    this.leftBtn = document.createElement("div");
    this.rightBtn = document.createElement("div");

    this.leftBtn.classList.add("btn", "leftBtn");
    this.rightBtn.classList.add("btn", "rightBtn");

    this.leftBtn.textContent = "<";
    this.rightBtn.textContent = ">";

    this.leftBtn.addEventListener("click", () => {
      const prev = this.getImageIndex(-1);
      this.setImage(prev);
    });

    this.rightBtn.addEventListener("click", () => {
      const next = this.getImageIndex();
      this.setImage(next);
    });

    this.render();
  }

  setImage(imgIndex: number) {
    const src = this.images[imgIndex];

    if (this.currentImg) {
      this.currentImg.src = src;
    } else {
      this.currentImg = new Image();
      this.currentImg.src = src;
      this.imgWrapper?.append(this.currentImg);
    }

    this.currentImgIndex = imgIndex;

    this.render();
  }

  getImageIndex(sign = 1) {
    const lastIndex = this.images.length - 1;
    let index = this.currentImgIndex;

    if (sign > 0) {
      return this.hasNext() ? ++index : 0;
    } else {
      return this.hasPrev() ? --index : lastIndex;
    }
  }

  async preloadImages() {
    await client.photos
      .search({ query: "Nature", per_page: this.count })
      .then((res) => {
        if ("photos" in res && Array.isArray(res.photos)) {
          res.photos.forEach((photo) => {
            const img = new Image();
            img.src = photo.src.small;
            this.images.push(img.src);
          });
        }
      });
  }

  hasPrev() {
    return this.currentImgIndex > 0;
  }

  hasNext() {
    const lastIndex = this.images.length - 1;
    return this.currentImgIndex < lastIndex;
  }

  render() {
    if (this.leftBtn) {
      if (!this.wrap?.contains(this.leftBtn)) {
        this.wrap?.append(this.leftBtn);
      }
      this.leftBtn.style.display = this.hasPrev() ? "block" : "none";
    }

    if (this.rightBtn) {
      if (!this.wrap?.contains(this.rightBtn)) {
        this.wrap?.append(this.rightBtn);
      }
      this.rightBtn.style.display = this.hasNext() ? "block" : "none";
    }
  }
}

const app = document.getElementById("app");
new Slider({ root: app, width: 600 });
