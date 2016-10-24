import React from 'react';
import Game from './Game';

class App extends React.Component {
  render(){
    return (
      <div>
        <CommentBox url="/api/comments" />
        <Timer initialSeconds={42} />
        <Button />
        <EmailForm currentEmail="mark@fb.com"/>
        <Container quotesData={quotesData} />
        <GameGrid />

      </div>
    )
  }
}

var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
        <CommentForm />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment){
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()}/>
      </div>
    );
  }
});

var Timer = React.createClass({
  getInitialState: function() {
    return {
      counter: this.props.initialSeconds };
    },
    componentDidMount: function() {
      var component = this, currentCounter;
      component.timerId = setInterval(function() {
        currentCounter = component.state.counter;
        if (currentCounter === 1) {
          clearInterval(component.timerId);
        } component.setState({
          counter: currentCounter - 1
        }); }, 1000);
       },
       render: function() {
         return (
           <div>
             {this.state.counter}
           </div>
         );
       }
  });

  const logClicksMixin = {
    logClick() {
      console.log(`Element ${this.props.id} clicked`);
      $.post(`/clicks/${this.props.id}`);
    }
  };

  const Button = React.createClass({
    mixins: [logClicksMixin],
    handleClick(e) {
      this.logClick();
      e.preventDefault();
      console.log("Handling a button click...");
    },
    render() {
      return (
        <button onClick={this.handleClick}>Button</button>
      );
    }
  });

  const EmailForm = React.createClass({
    getInitialState() {
      return {
        currentEmail: this.props.currentEmail
      };
    },
    setCurrentEmailState(se) {
      this.setState({ currentEmail: se.target.value })
    },
    handleClick() {
      console.log(`Saving New Email as ${this.state.currentEmail}`);
    },
    render() {
      return (
        <div>
          <input type="email" value={this.state.currentEmail}
            onChange={this.setCurrentEmailState} />
          <button onClick={this.handleClick}>Save</button>
       </div>
     );
   }
 });

 class Quote extends React.Component {

   render() {
     return (
       <div className="quote-container">
         <div className="quote-body">{this.props.body}</div>
         <div className="quote-author-name">{this.props.authorName}</div>
       </div>
     );
   }
 }

var quotesData = [
  {
    body: "Insanity is hereditary. you get it from your children",
    authorName: "Sam Levenson"
  },
  {
    body: "Be yourself; everyone else is already taken",
    authorName: "Oscar Wilde"
  },
  {
    body: "Underpromise and overdeliver",
    authorName: "Unknown"
  }
];

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentQuoteIdx: 0};
  }
  nextQuote(increment) {
    var newQuoteIdx = this.state.currentQuoteIdx + increment;
    if (!this.props.quotesData[newQuoteIdx]) {
      return;
    }
    this.setState({ currentQuoteIdx: newQuoteIdx });
  }
  render() {
    var currentQuote = this.props.quotesData[this.state.currentQuoteIdx];
    return (
      <div className="container">
        <h1>Quotes</h1>
        <Quote {...currentQuote} />
        <hr />
        <div className="control-buttons">
          <button onClick={this.nextQuote.bind(this, -1)}>
            Previous Quote
          </button>
          <button onClick={this.nextQuote.bind(this, +1)}>
            Next Quote
          </button>
        </div>
      </div>
    );
  }
}

class GameGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = { gameId: 1 };
  }
  createNewGame() {
    this.setState({ gameId: this.state.gameId + 1 })
  }
  render() {
    return (
      <div>
        <Game key={this.state.gameId}
              createNewGame={this.createNewGame.bind(this)}
              rows={5} columns={5}
              activeCellsCount={6} />
      </div>
    )
  }
}


export default App
