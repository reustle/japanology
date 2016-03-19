var Session = {
  get : function(key){
    return JSON.parse(localStorage.getItem(key));
  },
  set : function(key, val){
    if(!val || isNaN(val)){
      localStorage.removeItem(key);
      return;
    }else if(typeof(val) == 'string' && val.length == 0){
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, JSON.stringify(val));
  }
};
