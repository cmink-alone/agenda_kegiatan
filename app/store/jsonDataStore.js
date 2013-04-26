Ext.define('MP.store.jsonDataStore', {

    extend: 'Ext.data.Store',
    fields: [''],

    constructor: function(c) {
        Ext.apply(c, {            
            remoteSort: true,
            proxy: {
                url: c.url,
                extraParams: c.params,
                type: 'ajax',
                actionMethods: {
                    read: 'POST'
                },
                reader: {
                    type: 'json',
                    root: 'topics',
                    totalProperty: 'totalCount'
                },
                simpleSortMode: true
            }
        });

        this.callParent(arguments);
    }

});