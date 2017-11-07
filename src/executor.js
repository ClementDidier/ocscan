const async = require('async');

class Executor
{
    constructor()
    {
        this.queue = [];
        this.isRunning = false;
    }

    enqueue(func, context, params)
    {
        this.queue.push({ 'function': func, 'context': context, 'parameters':params });
        this.start();
    }

    start()
    {
        if(this.queue.length == 0 || this.isRunning)
            return;

        this.isRunning = true;

        var obj = this.queue.shift();

        obj.function.apply(obj.context, obj.parameters).then(() =>
        {
            this.isRunning = false;
            
            if(this.queue.length > 0) {
                this.start();
            }
        });
    }
}

module.exports = Executor;
