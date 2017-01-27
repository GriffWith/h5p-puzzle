var H5P = H5P || {};

H5P.Puzzle = (function ($) {
  /**
   * Constructor function.
   */
  function Puzzle(options, contentId) {
    H5P.EventDispatcher.call(this);
    // Extend defaults with provided options
    this.options = $.extend(true, {}, {
      image: null,
      numCols: 3,
      numRows: 3
    }, options);
    // Keep provided id.
    this.contentId = contentId;
  };
  Puzzle.prototype = Object.create(H5P.EventDispatcher.prototype);
  Puzzle.prototype.constructor = Puzzle;
  
  

  /**
   * Attach function called by H5P framework to insert H5P content into
   * page
   *
   * @param {jQuery} $container
   */
  Puzzle.prototype.attach = function ($container) {
    var self = this;
    // Set class on container to identify it as a greeting card
    // container.  Allows for styling later.
    $container.addClass("h5p-puzzle");
    
    this.$container = $container;
    
    // Add image if provided.
    if (this.options.image && this.options.image.path) {
      
      var image = new Image();
      image.onload = function() {
        self.image$Pieces = self.cutUpImage(image);
        self.placeImages();
      };
      image.src = H5P.getPath(this.options.image.path, this.contentId);
    }
    // TODO - need to wait for image beeing loaded
    // For now using timer. Should wait for image is loaded...
    setTimeout(function () {
      self.trigger('resize');
    }, 1000);
  };
  Puzzle.prototype.cutUpImage = function(image) {
    var image$Pieces = [];
    var pieceWidth = this.options.image.width / this.options.numCols;
    var pieceHeight = this.options.image.height / this.options.numRows;
    for(var x = 0; x < this.options.numCols; ++x) {
      for(var y = 0; y < this.options.numRows; ++y) {
        var canvas = document.createElement('canvas');
        canvas.width = pieceWidth;
        canvas.height = pieceHeight;
        var context = canvas.getContext('2d');
        context.drawImage(image, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, canvas.width, canvas.height);
        var imagePiece = new Image(pieceWidth, pieceHeight);
        imagePiece.src = canvas.toDataURL();
        imagePiece.className = 'h5p-puzzle-piece';
        image$Pieces.push(imagePiece);        
      }
    }
    return image$Pieces;
  };
  
  Puzzle.prototype.placeImages = function() {
    for (var i =  0; i < this.image$Pieces.length; i++) {
      this.$container.append(this.image$Pieces[i]);
    }
  };

  return Puzzle;
})(H5P.jQuery);
