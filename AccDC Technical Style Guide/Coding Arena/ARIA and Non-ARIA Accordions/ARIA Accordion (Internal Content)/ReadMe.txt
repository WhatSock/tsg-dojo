To automatically render an ARIA Toggle as the accordion triggering element, simply add role="button" to the triggering element.

This implementation pulls accordion content from within the same page.
When loaded, the DOM node for each accordion content container is removed from the DOM, and stored within the AccDC Object that is associated with the triggering element.
This is done to prevent ID conflicts when event handlers are applied after an accordion section opens.

HTML5 "data-" attributes are used to configure specific functionality for each accordion expand/collapse link.

Available HTML5 attributes for the triggering element:

� data-src : The resource path and pointer to the ID attribute of the accordion content container element.
If set, data-internal should be blank or not included. 
� data-internal : The ID attribute of the accordion content container element within the same document.
If data-internal is set, data-src should be blank or not included. 
� data-defaultopen="true" : Specifies that the referenced accordion node will open automatically. Only one accordion node per group should include this attribute. 
� data-insert : The ID attribute of the container element where accordion node content will be inserted. The referenced container element must not be included within the accordion link node. 

Required attributes for the triggering element:

� id : The unique ID of the element. This value is also registered as the ID of the individual accordion node AccDC Object, making it possible to invoke
the object programmatically.
E.G $A.reg.uniqueID.open();
// All other AccDC API properties and methods are similarly available.    
    