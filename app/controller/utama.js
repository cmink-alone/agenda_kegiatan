Ext.define('MP.controller.utama', {
    extend: 'Ext.app.Controller',

    views: ['utama','MonthPicker'],

     refs: [
        {ref: 'utama', selector: 'utama'}
    ],

    init: function() {
        var me = this;

        this.control({
            'utama' : {
                afterrender: function(c) {
                    c.eventStore.setAllowLoad(true);
                    c.eventStore.on({
                        load: function(e, records, successful, eOpts) {
                            if(successful && me.ta_select) {
                                c.gridStore.loadRawData(c.eventStore.proxy.reader.jsonData);
                                this.ta_select = false;
                            }
                        }
                    });
                }
            },

            'utama [name=ta]': {
                afterrender: this.ta_afterrender,
                select: this.ta_select
            },

            'utama grid': {
                selectionchange: this.grid_selection
            }
        });
    },

    grid_selection: function(view, selections) {
        var utama = this.getUtama();
        if(selections[0])
           utama.down('calpanel').setStartDate(new Date(selections[0].data['start']));
    },

    ta_select: function(c) {
        var me = this,
            utama = c.up('utama'),
            eventStore = utama.eventStore,
            proxy = eventStore.getProxy();

        proxy.extraParams['id'] = c.getValue();
        me.ta_select = true;
        eventStore.loadPage(1);
    },

    ta_afterrender: function(c) {
        c.getStore().on({
            load: function(e, records, successful, eOpts) {
                if(successful) {
                    var utama = c.up('utama');
                    for(var i=0; i<e.getCount(); i++) {
                        if(e.getAt(i).data['aktif']=='Y') {
                            utama.down('[name=ta]').setValue(e.getAt(i).data['id']);
                            utama.down('[name=ta]').fireEvent('select', utama.down('[name=ta]'));
                            return;
                        }
                    }
                }
            }
        });
    }
});
