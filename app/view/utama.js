Ext.define('MP.view.utama', {
    
    extend: 'Ext.container.Viewport',
    alias : 'widget.utama',
    layout: 'border',
    autoShow: true,
    
    initComponent: function() {
        var me = this;

        var renderTopic = function renderTopic(value, p, record) {
            return Ext.Date.format(new Date(record.data['start']), 'd.m.Y') + ' - ' + Ext.Date.format(new Date(record.data['end']), 'd.m.Y');
        };

        this.eventStore = Ext.create('Ext.calendar.data.MemoryEventStore', {
            url: 'store/eventStore.php'
        });

        this.gridStore = Ext.create('Ext.data.Store', {
            fields: ['cid', 'start', 'end', 'title'],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'topics'
                }
            }
        });

        this.items = [{
            xtype: 'box',
            id: 'header',
            region: 'north',
            html: '<h1>Kalender Akademik</h1>',
            height: 30
        }, {
            xtype: 'panel',
            title: 'Daftar Kegiatan',
            collapsible: true,
            animCollapse: true,
            split: true,
            region: 'west',
            width: 350,
            layout: 'border',
            items: [{
                xtype: 'datepicker',
                region: 'south',
                cls: 'ext-cal-nav-picker',
                listeners: {
                    'select': {
                        fn: function(dp, dt) {
                            me.down('calpanel').setStartDate(dt);
                            //me.down('calpanel').setTitle(Ext.Date.format(dt, 'F Y'));
                        },
                        scope: this
                    }
                }
            }, {
                xtype: 'grid',
                cls: 'custom-grid', 
                border: false,
                columnLines: true,
                tbar: [Ext.create('Ext.toolbar.Toolbar', {
                    flex: 1,
                    items: [{
                        tooltip: 'Tambah',
                        iconCls: 'add'
                    }, {
                        tooltip: 'Ubah',
                        iconCls: 'edit',
                        disabled: true
                    }, {
                        tooltip: 'Hapus',
                        iconCls: 'delete',
                        disabled: true
                    },'-', {
                        xtype: 'combobox',
                        name: 'ta',
                        store: Ext.create('MP.store.jsonDataStore', {
                            fields: ['id', 'keterangan', 'aktif'],
                            url: 'store/taDataStore.php',
                            autoLoad: true
                        }),
                        fieldLabel: 'Tahun Akademik',
                        labelWidth: 90,
                        flex: 1,
                        valueField: 'id',
                        displayField: 'keterangan',
                        queryMode: 'local',
                        typeAhead: false
                    }]
                })],
                bbar: [Ext.create('Ext.PagingToolbar', {
                    store: this.gridStore,
                    flex: 1,
                    displayInfo: false
                })],
                store: this.gridStore,
                columns: [
                    {text: 'Tanggal', flex: 1, sortable: false, menuDisabled: 'true', renderer: renderTopic, align: 'center'},
                    {text: 'Keterangan', flex: 1.5, sortable: false, menuDisabled: 'true', dataIndex: 'title'}
                ],
                viewConfig: {
                    getRowClass: function(record) {
                        return 'ext-color-' + record.data['cid'] + '-grid';
                    }
                },
                region: 'center',
                flex: 1
            }]
        }, {
            xtype: 'calpanel',
            eventStore: this.eventStore,
            activeItem: 3,
            showNavBar: true,
            monthViewCfg: {
                showHeader: true,
                showWeekLinks: true,
                showWeekNumbers: true
            },

            split: true,
            region: 'center'
        }];
        this.callParent(arguments);
    }
});
