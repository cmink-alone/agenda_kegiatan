Ext.QuickTips.init();

Ext.Loader.setConfig({enabled:true});

Ext.Loader.setPath({
    'Ext.calendar': 'app/calendar'
});

Ext.application({
    name: 'MP',

    requires: [
        'MP.store.jsonDataStore',
        'Ext.picker.Date',
        'Ext.calendar.util.Date',
        'Ext.calendar.data.MemoryCalendarStore',
        'Ext.calendar.data.MemoryEventStore',
        'Ext.calendar.data.Events',
        'Ext.calendar.data.Calendars',
        'Ext.calendar.form.EventWindow',
        'Ext.calendar.CalendarPanel'
    ],

    controllers: [
        'utama'
    ],
    
    appFolder: 'app',

    launch: function() {        

        Ext.create('MP.view.utama');
        
    }
});