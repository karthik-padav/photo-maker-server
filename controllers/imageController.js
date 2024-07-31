const getImages = (req, res) => {
  res.status(200).json({ message: "getImages" });
};

const createImages = (req, res) => {
  res.status(200).json({ message: "createImages" });
};

module.exports = { getImages, createImages };
