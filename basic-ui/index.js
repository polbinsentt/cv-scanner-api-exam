const form = document.getElementById("cvFormUpload");
const cvFile = document.getElementById("cvFile");
const extractedName = document.getElementById("name");
const extractedEmail = document.getElementById("email");
const matched = document.getElementById("matchedKeywords");
const fullText = document.getElementById("fullText");

const activeContainer = document.getElementById("activeKeywords");
const inactiveContainer = document.getElementById("inactiveKeywords");

async function loadKeywords() {
  try {
    // API GET REQUEST for fetching keywords
    const res = await axios.get(
      "http://localhost:8080/api/v1/keywords?sortBy=name&sortOrder=asc&limit=100"
    );

    // Stores data if request succeeded
    const data = res.data;

    // Clears out DOM Content
    activeContainer.innerHTML = "";
    inactiveContainer.innerHTML = "";

    //Filters keywords based on their isActive status
    const activeKeywords = data.filter((keyword) => keyword.isActive);
    const inactiveKeywords = data.filter((keyword) => !keyword.isActive);

    //Populates active keywords
    activeKeywords.forEach((keyword) => {
      const card = document.createElement("div");
      card.className =
        "border px-2 py-0.5 h-fit rounded-sm bg-green-100 font-semibold";
      card.textContent = keyword.name;
      activeContainer.appendChild(card);
    });

    //Populates inactive keywords
    inactiveKeywords.forEach((keyword) => {
      const card = document.createElement("div");
      card.className =
        "border px-2 py-0.5 h-fit rounded-sm bg-red-100 font-semibold";
      card.textContent = keyword.name;
      inactiveContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error! fetching keywords failed:", err);
  }
}

//Checks if user is in keywords page and only runs this function if true
if (activeContainer && inactiveContainer) {
  loadKeywords();
}

//Runs only if user is in scan page
if (form) {
  form.addEventListener("submit", async (e) => {
    // Prevents form default behavior of automatic refresh of form upon submission
    e.preventDefault();

    //
    if (!e.submitter || e.submitter.type !== "submit") return;

    // Stores input file
    const file = cvFile.files[0];

    // Verifies if there's a file
    if (!file) {
      alert("Select a pdf file first!");
      return;
    }

    //Checks if it is a pdf file
    if (file.type !== "application/pdf") {
      alert("Only pdf file is accepted!");
      return;
    }

    //Stores and append file if pass verification
    const formData = new FormData();
    formData.append("cv", file);

    // API POST REQUEST for scanning the pdf file input
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/scan",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);
      alert("Successfully Uploaded");

      // Populates the DOM Element with their respective contents
      const name = res.data.extractedName;
      extractedName.textContent = name === null ? "[Name not found]" : name;
      extractedEmail.textContent = res.data.email;
      matched.textContent = res.data.matchedKeywords;
      const text = res.data.fullText;

      // Toggles border base on text
      if (text) {
        fullText.textContent = text;
        fullText.classList.add("border");
      } else {
        fullText.textContent = "";
        fullText.classList.remove("border");
      }
    } catch (err) {
      console.log(`Error: ${err}`);
      alert("Upload Failed");
    }
  });
}
