function populateSubjectModal(id, name, type) {
    const form = document.getElementById('subjectForm');
    form.querySelector('#subjectId').value = id;
    form.querySelector('#subjectName').value = name;
    form.querySelector('#subjectType').value = type;
}

function populateBookModal(id, bookName, description) {
    const form = document.getElementById('bookForm');
    form.querySelector('#bookId').value = id;
    form.querySelector('#bookName').value = bookName;
    form.querySelector('#bookDescription').value = description;
}

// Optional: Refresh page after successful form submission
document.getElementById('subjectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const response = await fetch('/Dashboard/UpdateSubjectOrChapter', {
        method: 'POST',
        body: new FormData(e.target)
    });
    if (response.ok) {
        document.getElementById('subjectModal').close();
        location.reload(); // Refresh to update UI
    }
});

document.getElementById('bookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const response = await fetch('/Dashboard/UpdateBook', {
        method: 'POST',
        body: new FormData(e.target)
    });
    if (response.ok) {
        document.getElementById('bookModal').close();
        location.reload(); // Refresh to update UI
    }
});
