document.getElementById("quoteForm").onsubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const res = await fetch("/api/quote", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  document.getElementById("result").innerText =
    `Price: $${data.price} | Print Time: ${data.hours} hrs`;
};
