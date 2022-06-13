Vue.component('bot-ui',{
  template: 
    `<div class="botui botui-container" v-botui-container>
      <div class="botui-messages-container">
        <div v-for="msg in messages" class="botui-message" v-botui-scroll>
          <div v-bind:class="[{human: msg.human, \'botui-message-content\': true}, msg.type]">
            <span v-text="msg.content" v-botui-markdown></span>
          </div>
        </div>
      </div>
    </div>`,
  data: function () {
    return {
      container: null,
      messages: []
    };
  },
  methods: {
    addMessage: function (_msg) {
      if(!_msg.loading && !_msg.content) {
        throw Error('BotUI: "content" is required in a non-loading message object.');
      }

      _msg.type = _msg.type || 'text';
      _msg.visible = (_msg.delay || _msg.loading) ? false : true;
      var _index = this.messages.push(_msg) - 1;

      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          if(_msg.delay) {
            _msg.visible = true;

            if(_msg.loading) {
              _msg.loading = false;
            }
          }
          resolve(_index);
        }, _msg.delay || 0);
      });
    },
    removeMessage: function (index) {
      this.messages.splice(index, 1);
      return Promise.resolve();
    },
    removeMessageAll: function () {
      this.messages.splice(0, this.messages.length);
      return Promise.resolve();
    }
  }
});

Vue.directive('botui-scroll', {
  inserted: function (el) {
    this.container.scrollTop = this.scrollHeight;
	  el.scrollIntoView(true);
  }
});

Vue.directive('botui-container', {
  inserted: function (el) {
    this.container = el;
  }
});
