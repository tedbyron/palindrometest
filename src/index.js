import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

/**
 * function that checks if a string is a palindrome
 * @param {string} str - the string to check
 * @returns {boolean} true if the string is a palindrome, false otherwise
 */
function isPalindrome(str) {
  // get only alphanumeric characters from the string, ignore case
  let strAlpha = str.toLowerCase().match(/[a-z0-9]+/g).join('');

  // compare the string with its reverse and return the result
  return (strAlpha === [...strAlpha].reverse().join(''));
}

/**
 * main component class for the palindrome checker page
 */
class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      url: 'https://raw.githubusercontent.com/bungard/PalindromeTest/master/string.json'
    }
  }

  /**
   * fetch a JSON file from a URL and check if the strings in it are palindromes
   * @param {string} jsonURL - URL of the JSON file to check
   */
  parseJSON = jsonURL => {
    fetch(jsonURL)
      .then(response => {
        // check if HTTP status code is unsuccessful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // resolve the response as text
        return response.text();
      })
      .then(text => {
        // throw an error if the text is not valid JSON
        try {
          return JSON.parse(text);
        } catch {
          throw new Error('URL does not contain valid JSON');
        }
      })
      .then(json => {
        let resultsList = document.getElementById('results-list');

        // clear the previous isPalindrome() results
        resultsList.innerHTML = '';

        // check if the JSON follows the correct format
        if (!json.hasOwnProperty('strings')) {
          throw new Error('Improperly formatted JSON: "strings" property does not exist');
        } else {
          let stringsAreValid = true;

          for (const property in json.strings) {
            if (!json.strings[property].hasOwnProperty('str') || typeof json.strings[property].str !== 'string') {
              stringsAreValid = false;
              break;
            }
          }

          if (!stringsAreValid) {
            throw new Error('Improperly formatted JSON: one or more invalid strings')
          }
        }

        for (const property in json.strings) {
          // check if the string is a palindrome
          let str = json.strings[property].str;
          let strIsPalindrome = isPalindrome(str);

          // create HTML elements to display isPalindrome() results
          let strName = document.createElement('li');
          let strResult = document.createElement('ul');
          let strResultItem = document.createElement('li');

          // update the new HTML elements
          strName.innerHTML = `"${str}"`;
          strResultItem.innerHTML = `${strIsPalindrome}, is${strIsPalindrome ? '' : ' not'} a palindrome.`;

          // insert the new HTML elements into the DOM
          strResult.appendChild(strResultItem);
          resultsList.append(strName, strResult);
        }
      })
      .catch(error => {
        document.getElementById('results-list').innerHTML = error;
      });
  }

  /**
   * update state with the new JSON URL and parse the file at that URL
   * @param {string} newURL - new JSON URL to use
   */
  setURL = newURL => {
    this.setState({
      url: newURL
    });
    this.parseJSON(newURL);
  }

  componentDidMount() {
    // when the main component loads, set the text box url, add event listeners to the buttons, and run the program on the initial URL
    document.getElementById('input-url').value = this.state.url;
    document.getElementById('input-go').addEventListener('click', () => {
      this.setURL(document.getElementById('input-url').value);
    });
    document.getElementById('input-view').addEventListener('click', () => {
      window.open(this.state.url);
    });
    this.parseJSON(this.state.url);
  }

  render() {
    return (
      <div className="main">
        <h1>Palindrome Test</h1>

        <div className="url-input">
          <label htmlFor="input-url">JSON file URL</label>
          <input type="text" name="input-url" id="input-url" size="50" autoFocus required/>
          <div>
            <input type="button" id="input-go" value="Check Palindromes"/>
            <input type="button" id="input-view" value="Open URL"/>
          </div>
        </div>

        <h2>Results</h2>

        <ol className="results-list" id="results-list" start="0"></ol>
      </div>
    );
  }
}

// render the main component into the DOM in #root
ReactDOM.render(
  <Main/>,
  document.getElementById('root')
);
