angular.module("App").service("ouiMessageAlerter", class OuiMessageAlerter {

    constructor ($timeout) {
        // Injections
        this.$timeout = $timeout;

        // Other attributes
        this.messages = []; // list of messages
    }

    /* ==============================================
    =            MESSAGE LIST MANAGEMENT            =
    =============================================== */

    /* ----------  Adding messages  ---------- */

    /**
     *  Add a new message in message list.
     *
     *  @param  {String} message            The message to display.
     *  @param  {String} type               The type of the message (error, warning, info, success).
     *  @param  {String} context            The context where the message is displayed (contretely the state where to display the message).
     *  @param  {Object} options            Display options of the message.
     *  @param  {Number} options.hideAfter  Time in millisecond after which the message is hidden.
     *
     *  @return {Object}    The new message added
     */
    pushMessage (message, type, context, options) {
        if (!context) {
            return null;
        }

        const timeout = _.get(options, "hideAfter");
        const msg = {
            content: message,
            type,
            context
        };

        this.messages.push(msg);

        if (angular.isNumber(timeout)) {
            msg.timeout = this.$timeout(() => {
                this.removeMessage(msg, true);
            }, timeout);
        }

        return msg;
    }

    /**
     *  Add a success message to message list.
     *
     *  @param  {String} message    The message to display.
     *  @param  {String} context    The context where the message is displayed (contretely the state where to display the message).
     *  @param  {Object} options    Display options of the message (see pushMessage for more details).
     *
     *  @return {Object}    The new success message added.
     */
    success (message, context, options) {
        return this.pushMessage(message, "success", context, options);
    }

    /**
     *  Add an info message to message list.
     *
     *  @param  {String} message    The message to display.
     *  @param  {String} context    The context where the message is displayed (contretely the state where to display the message).
     *  @param  {Object} options    Display options of the message (see pushMessage for more details).
     *
     *  @return {Object}    The new info message added.
     */
    info (message, context, options) {
        return this.pushMessage(message, "info", context, options);
    }

    /**
     *  Add a warning message to message list.
     *
     *  @param  {String} message    The message to display.
     *  @param  {String} context    The context where the message is displayed (contretely the state where to display the message).
     *  @param  {Object} options    Display options of the message (see pushMessage for more details).
     *
     *  @return {Object}    The new warning message added.
     */
    warning (message, context, options) {
        return this.pushMessage(message, "warning", context, options);
    }

    /**
     *  Add an error message to message list.
     *
     *  @param  {String} message    The message to display.
     *  @param  {String} context    The context where the message is displayed (contretely the state where to display the message).
     *  @param  {Object} options    Display options of the message (see pushMessage for more details).
     *
     *  @return {Object}    The new error message added.
     */
    error (message, context, options) {
        return this.pushMessage(message, "error", context, options);
    }

    /* ----------  Remove messages  ---------- */

    /**
     *  Remove a message from message list.
     *
     *  @param  {Object}    message           The message to remove.
     *  @param  {Boolean}   omitCancelTimeout Omit to cancel timeout message in case hideAfter option is specified.
     *
     *  @return {Object}    The removed message.
     */
    removeMessage (message, omitCancelTimeout) {
        if (message.timeout && !omitCancelTimeout) {
            this.$timeout.cancel(message.timeout);
        }

        return _.remove(this.messages, message);
    }

    /**
     *  Remove messages from message list by specifying filters.
     *
     *  @param  {Object|Function} filters   Object of message attributes to filter or a function used to filter messages.
     *
     *  @return {Array} The messages that have been removed.
     */
    removeMessagesByFilter (filters) {
        return this.getMessagesFiltered(filters).forEach((message) => {
            this.removeMessage(message);
        });
    }

    /* -----  End of MESSAGE LIST MANAGEMENT  ------ */

    /* ===================================
    =            GET MESSAGES            =
    ==================================== */

    /**
     *  Get all messages from list.
     *
     *  @return {Array} The messages added to the list.
     */
    getMessages () {
        return this.messages;
    }

    /**
     *  Get message by specifying filters.
     *
     *  @param  {Object|Function} filters   Object of message attributes to filter or a function used to filter messages.
     *
     *  @return {Array}     The messages filtered.
     */
    getMessagesFiltered (filters = {}) {
        return _.filter(this.getMessages(), filters);
    }

    /* -----  End of GET MESSAGES  ------ */

});
