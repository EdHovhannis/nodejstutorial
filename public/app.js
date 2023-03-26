const ToCurrency = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(price);
};

document.querySelectorAll('.price').forEach((node) => {
  node.innerHTML = ToCurrency(node.textContent);
});

const $cart = document.querySelector('#cart');
if ($cart) {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf;
      fetch('/cart/remove/' + id, {
        method: 'delete',
        headers: {
          'X-CSRF-Token': csrf,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.courses.length) {
            const html = data.courses
              .map(
                (course) => `
              <tr>
                  <td>
                    <img src=${course.img} alt=${course.title} style='width: 32px;' />
                  </td>
                  <td>${course.title}</td>
                  <td>${course.price}</td>
                  <td>${course.count}</td>
                  <td>
                    <span
                      style='color: red; cursor: pointer;'
                      class='js-remove'
                      data-id=${course._id}  
                    >Delete</span>
                  </td>
              </tr>
            `
              )
              .join('');
            $cart.querySelector('tbody').innerHTML = html;
            $cart.querySelector('.price').textContent = ToCurrency(data.price);
          } else {
            $cart.innerHTML = '<h1>No orders yet</h1>';
          }
        });
    }
  });
}
const dateinOrder = document.querySelectorAll('.date');

dateinOrder.forEach((node) => {
  node.textContent = new Date(node.textContent).toLocaleDateString();
});

M.Tabs.init(document.querySelectorAll('.tabs'));
