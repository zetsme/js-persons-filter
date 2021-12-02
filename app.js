const gridContainer = document.querySelector('.grid');
const searchInput = document.querySelector('input[type="search"]');
const showMoreBtn = document.querySelector('.btn__show-more');

const personsArr = [];

const PERSONS_TO_SHOW = 5;

const fetchData = async () => {
  searchInput.value = '';
  const res = await fetch(`https://fakerapi.it/api/v1/persons?_quantity=${PERSONS_TO_SHOW}`);
  const { data } = await res.json();
  personsArr.push(...data);
  loadPosts(personsArr.sort((a, b) => new Date(a.birthday) - new Date(b.birthday)));
};
fetchData();

const loadPosts = (data) => {
  gridContainer.innerHTML = data.map(generateCard).join('');
};

const keysArr = ['email', 'phone', 'birthday', 'gender', 'city', 'country'];

const generateCard = (person) => {
  const cardInfo = keysArr.reduce((acc, cur) => {
    acc[cur] = person[cur] || person.address[cur];
    return acc;
  }, {});
  return `
  <article class="card">
    <header class="card__header">
        <h3>${person.firstname}</h3>
        <h3>${person.lastname}</h3>
    </header>
    <div class="card__info">
      <ul>
        ${Object.entries(cardInfo)
          .map(
            ([key, value]) =>
              `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}: </strong>${value}</li>`
          )
          .join('')}
      </ul>
    </div>
  </article>
  `;
};

const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
const filterPersons = () => {
  const searchFilter = (person) =>
    [person.firstname, person.lastname, person.address.city, person.address.country]
      .join('')
      .toLowerCase()
      .indexOf(searchInput.value.toLowerCase()) !== -1;
  loadPosts(personsArr.filter(searchFilter));
};

showMoreBtn.addEventListener('click', fetchData);
searchInput.addEventListener('input', debounce(filterPersons, 300));
