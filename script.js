
  const secret = ["n", "a", "n", "a"];
  let input = [];

  window.addEventListener("keydown", e => {
    input.push(e.key.toLowerCase());
    input.splice(-secret.length - 1, input.length - secret.length);

    if (input.join("") === secret.join("")) {
      window.open(
        "https://animesonlinecc.to/anime/nanatsu-no-taizai-hd/",
        "_blank"
      );
      input = [];
    }
  });
