module.exports = () => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
      crossorigin="anonymous"
    />
    <title>Test Management Tool</title>
  </head>
  <body>
    <div class="container">
      <nav class="navbar navbar-light bg-light">
        <span class="navbar-brand mb-0 h1">Test Management Tool</span>
      </nav>
      %TEST_SUITE%
    </div>
  </body>
</html>`;
};
