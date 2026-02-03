async function load() {
  const password = prompt("Admin password");
  const res = await fetch("/api/admin/pricing", {
    headers: { Authorization: password }
  });
  document.getElementById("pricing").value =
    JSON.stringify(await res.json(), null, 2);
}

async function save() {
  const password = document.getElementById("password").value;
  const data = JSON.parse(document.getElementById("pricing").value);

  await fetch("/api/admin/pricing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: password
    },
    body: JSON.stringify(data)
  });

  alert("Saved!");
}

load();
