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


    /*render: function(comp) {
        var me = this,
            form = comp.down('form[name=utama]');
        
        form.getForm().submit({
            params: {first: 'Y'},
            success:function(f, action) {
                comp.aksesStore.loadPage(1);
            },
            failure:function() {
                me.offline(comp);
                me.removeMask();
            }
        });

        comp.aksesStore.on({
            load: function(store, records, successful, eOpts) {
                if(successful) {                    
                    if(store.getCount()==0)
                        me.offline(comp);
                    else
                        me.online(comp);

                    me.removeMask();
                    if(form.myMask) form.myMask.hide();
                }
            }
        });

    },

    removeMask: function() {
        if(Ext.get('loading-mask')) {
            Ext.get('loading').remove();
            Ext.get('loading-mask').fadeOut({remove:true});
        }
    },

    init: function() {

        this.control({

            'utama': {
                render: this.render
            },

            'utama button[action=logout]': {
                click: this.logout
            },

            'utama treepanel[itemId=mainmenu]': {
                itemclick: this.openModul
            },

            'utama dataview[name=setting]': {
                itemclick: this.onSelectionChange
            }
        });
    },
    

    onSelectionChange: function(dv, selected) {

        var comp = Ext.getCmp('utama');        
        if(selected) {
            if(selected.data['text']=='Logout') this.logout(comp);
            else Ext.create(selected.data['modul'], {modal: true}).show();
        }

    },

    openModul: function(tp, record) {
        
        if(record && record.data['modul']!='') {
            var me = this,
                comp = Ext.getCmp('utama'),
                tabpanel = comp.down('tabpanel[name=utama]');
            for(var i=0; i<tabpanel.items.length; i++) {
                if(record.data['idmodul']==tabpanel.items.getAt(i).modulId) {
                    tabpanel.setActiveTab(i);
                    return;
                }
            }

            var win = Ext.create(record.data['modul'], {
                    closable: true,
                    aksesStore: comp.aksesStore
                }),
                store = comp.aksesStore;
            new PL.view.akses().cekMenu(store, win);

            tabpanel.add(win).show();
        }
    },

    logout: function(comp) {
        var me = this,
            form = comp.down('form[name=utama]');

        form.getForm().waitMsgTarget = form.getEl();
        form.getForm().load({
            waitMsg: 'Keluar...',
            url: 'store/logout.php',
            failure:function() {
                var tabpanel = comp.down('tabpanel[name=utama]');
                for(var i=tabpanel.items.length-1; i>=0; i--)
                    tabpanel.items.getAt(i).close();

                me.offline(comp);
            }
        });
   },

    showWindow: function(tab, w) {
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Loading..."});
        myMask.show();

        var f = function(){
            return function() {
                if(tab.popup==undefined)
                    tab.popup = new Array();

                tab.add(w);
                tab.popup[tab.popup.length] = w;
                w.on('close', function() {
                   w.closed = true;
                   delete w; //this.popup[tab.popup.length] = undefined;
                }, tab, { single: true });
                w.show();
                myMask.hide();
            };
        };

        setTimeout(f(), 0);
    },

    tabchange: function(tab) {
        if (tab.popup !== undefined) 
            for(var i=0; i<tab.popup.length; i++) 
                if(!tab.popup[i].closed) tab.popup[i].show();
    },

    offline: function(comp) {

        var tab = new Array();
            
        tab[0] = Ext.create('Ext.panel.Panel', {
                    itemId: 'tablogin',
                    title: 'Silahkan Login',
                    layout: {
                            align: 'stretch',
                            type: 'hbox'
                    },
                    items: [{
                        xtype: 'container',
                        flex: 1
                    }, {
                        xtype: 'container',
                        width: 400,
                        layout: {
                            align: 'stretch',
                            type: 'vbox'
                        },
                        items: [{
                            xtype: 'container',
                            flex: 1
                        }, Ext.create('PL.view.login.loginWindow', {
                            formUtama: comp.down('form[name=utama]'),
                            constrain: true
                        }), {
                            xtype: 'container',
                            flex: 1
                        }]

                    }, {
                        xtype: 'container',
                        flex: 1
                    }]
                });

        tab[1] = Ext.create('PL.view.laputama.list', {
                itemId: 'laputama'
            });

        for(var i=0; i<tab.length; i++)
            comp.down('tabpanel[name=utama]').add(tab[i]).show();

        Ext.getCmp('status').setStatus({
            text: 'Offline',
            iconCls: 'x-status-error'
        });
        comp.down('tbtext[name=nameuser]').setText('No User Login');

        comp.down('#mainmenu').getRootNode().removeAll();
        comp.down('#mainmenu').getStore().getProxy().extraParams['tipe'] = 'off';
        comp.down('#mainmenu').getStore().load();

        comp.down('dataview[name=setting]').getStore().removeAll();
        comp.down('panel[name=setting]').collapse();
    },

    online: function(comp) {

        var tab = Ext.create('Ext.panel.Panel', {
                    itemId: 'tabwelcome',
                    title: 'Selamat Datang',
                    closable: true,
                    layout: {
                            align: 'stretch',
                            type: 'vbox'
                    },
                    items: [{
                        xtype: 'container',
                        flex: 1
                    }, {
                        xtype: 'displayfield',
                        flex: 1,
                        hideLabel: true,
                        fieldStyle: 'text-align: center;',
                        value: '<B>Selamat Datang di Applikasi dirpam!</B>'
                    }, {
                        xtype: 'container',
                        flex: 1
                    }]
                });

        comp.down('tabpanel[name=utama]').add(tab).show();

        var index = comp.aksesStore.indexOf(comp.aksesStore.findRecord('idmodul', 'CA'));        
        if(index>-1) {
            var win = Ext.create('PL.view.calendar.list', {
                    closable: true,
                    aksesStore: comp.aksesStore
                }),
                store = comp.aksesStore;
            new PL.view.akses().cekMenu(store, win);

            comp.down('tabpanel[name=utama]').add(win).show();
        }
        
        Ext.getCmp('status').setStatus({
            text: 'Online',
            iconCls: 'x-status-valid'
        });

        comp.down('tbtext[name=nameuser]').setText(comp.aksesStore.getAt(0).data['namauser']);
        
        comp.down('#mainmenu').getRootNode().removeAll();
        comp.down('#mainmenu').getStore().getProxy().extraParams['tipe'] = 'on';
        comp.down('#mainmenu').getStore().load();

        comp.down('dataview[name=setting]').getStore().loadPage(1);
        comp.down('panel[name=setting]').expand();

    }*/
});