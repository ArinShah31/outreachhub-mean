async function getContacts() {
  let contact;
  await fetch("http://localhost:3000/Contact")
    .then((res) => res.json())
    .then((res) => (contact = res));
  return contact;
}

async function saveContact(contact) {
  if (contact.id !== "") {
    await fetch(
      "http:///Contact/" + contact.id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log("Record Updated");
        localStorage.setItem(
          "dialogMessage",
          JSON.stringify({
            text: "Contact Updated successful!",
            type: "info",
          })
        );
        window.location.href = `contacts-details.html?id=${res.id}`;
      });
  } else {
    await fetch("http://localhost:3000/Contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Record Inserted");
        localStorage.setItem(
          "dialogMessage",
          JSON.stringify({
            text: "Contact Inserted successful!",
            type: "success",
          })
        );
        window.location.href = `contacts-details.html?id=${res.id}`;
      });
  }
}

async function getContactById(id) {
  let contact;
  await fetch("http://localhost:3000/Contact/" + id)
    .then((res) => res.json())
    .then((res) => {
      contact = res;
    });
  return contact;
}

async function deleteContact(id) {
  await fetch("http://localhost:3000/Contact/" + id, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) {
      localStorage.setItem(
        "dialogMessage",
        JSON.stringify({
          text: "Something went wrong",
          type: "warning",
        })
      );
    } else {
      localStorage.setItem(
        "dialogMessage",
        JSON.stringify({
          text: "Contact Deleted successful!",
          type: "success",
        })
      );
    }
  });
}