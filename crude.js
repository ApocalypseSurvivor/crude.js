//
//    _____                _        _
//   / ____|              | |      (_)
//   | |    _ __ _   _  __| | ___   _ ___
//   | |   | '__| | | |/ _` |/ _ \ | / __|
//   | |___| |  | |_| | (_| |  __/_| \__ \
//   \_____|_|   \__,_|\__,_|\___(_) |___/
//                                _/ |
//  An Entity System Framework   |__/
//


// export the class if we are in a Node-like system.
if (typeof module === 'object' && module.exports === exports)
  exports = module.exports = new Crude()

function Crude() {
  var entities = []
  var processors = []
  var store = {}
  var lowestUnassignedEntityId = -1
  var uIntMax = Math.pow( 2, 53 ) - 1

  function generateEntityId () {

    if ( lowestUnassignedEntityId < uIntMax ) {
      lowestUnassignedEntityId += 1
      return lowestUnassignedEntityId
    }    //    if uIntMax

    return -1
  }  //  generateNewEntityId

  //
  this.addProcessor = function ( Type ) {

    var processor = new Type( this ), processorId = processors.push( processor ) - 1

    return processors[ processorId ]
  }  //  addProcessor

  //
  this.runProcessorsWithTimestep = function ( intervalMs ) {

    var startMs = ( new Date() ).getTime(), numProcessors = processors.length

    while ( numProcessors ) {
      numProcessors -= 1
      processors[ numProcessors ].step( intervalMs )
    }  //  while

    return ( new Date() ).getTime() - startMs
  }  //  runProcessorsWithTimestep

  //
  this.createEntity = function () {
    var new_id = generateEntityId()

    if ( new_id < 0 ) {
      return -1;
    }  //  if

    entities[ new_id ] = new_id
    return new_id
  }  //  createEntity

  //
  this.deleteEntity = function ( entity ) {

    var key = null, bModified = false

    if ( entities[ entity ] ) {
      entities[ entity ] = null
      bModified = true
    }

    for ( key in store ) {
      if ( store.hasOwnProperty( key ) ) {
        if ( store[ key ][ entity ] !== undefined ) {
          delete store[ key ][ entity ]
          bModified = true
        }  //  if not undefined
      }  //  if hasOwnProperty
    }  //  for key in

    return bModified
  }  //  deleteEntity

  //
  this.addComponent = function ( component, componentType, entity, replace ) {

    replace = ( replace === undefined ) ? true : replace

    if ( entity === null || entity === undefined ) {
      entity = this.createEntity()
    }  //  if no entity

    if ( entity < 0 ) {
      return entity
    }  //  if

    if ( store[ componentType ] === undefined ) {
      store[ componentType ] = {}
    } else {  //  if
      if ( ( store[ componentType ][ entity ] !== undefined ) && !replace ) {
        return null
      }  //  if
    }  //  else

    store[componentType][entity] = component
    return entity
  }  //  addComponent

  //
  this.getComponent = function ( componentType, entity ) {

    if ( store[ componentType ] === undefined ) {
      return null
    }  //  if undefined

    if ( store[ componentType ][ entity ] === undefined ) {
      return null
    }  //  if undefined

    return store[ componentType ][ entity ]
  }  //  getComponent

  //
  this.deleteComponent = function ( componentType, entity ) {

    if ( store[ componentType ] === undefined ) {
      return false
    }  //  if undefined

    if ( store[ componentType ][ entity ] === undefined ) {
      return false
    }  //  if undefined

    delete store[ componentType ][ entity ]

    return true
  }  //  deleteComponent

  //
  this.deleteComponent = function ( componentType, entity ) {

    if ( store[ componentType ] === undefined ) {
      return false
    }  //  if undefined

    if ( store[ componentType ][ entity ] === undefined ) {
      return false
    }  //  if undefined

    delete store[ componentType ][ entity ]

    return true
  } //  deleteComponent


  //
  this.deleteComponentsOfType = function ( componentType ) {

      if ( store[ componentType ] === undefined) {
          return false
      }  //  undefined

      delete store[ componentType ]

      return true
  }  //  deleteComponentsOfType

  //
  this.getComponentsOfType = function (componentType) {

      var aComponents = [], key = null

      if ( store[ componentType ] === undefined ) {
          return aComponents
      }  //  if undefined

      for ( key in store[ componentType ] ) {
          if ( store[ componentType ].hasOwnProperty( key ) ) {
              aComponents.push( store[ componentType ][ key ])
            }  //  if hasOwnProperty
      }  //  for

      return aComponents
  }  //  getComponentsOfType

  //
  this.getStoreOfType = function ( componentType ) {

      if ( store[ componentType ] === undefined ) {
          return null
      }  //  if undefined

      return store[ componentType ]
  }  //  getStoreOfType

  //
  this.getEntitiesPossessingComponentsOfType = function (componentType) {
    var aEntities = [], key = null

    if ( store[componentType] === undefined ) {
        return aEntities
    }  //  if undefined

    for ( key in store[ componentType ] ) {
        if ( store[ componentType ].hasOwnProperty( key ) ) {
            aEntities.push( key )
        }  //  if hasOwnProperty
    }  //  for

    return aEntities
  }  //  getEntitiesPossessingComponentsOfType

}  //  Crude

// -fin
//
