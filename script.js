

// Declare app level module which depends on filters, and services
var app = angular.module('app', []);
app.controller('mainController', function ($scope){
  
  $scope.items=[
  {
    src:"https://www1.bac-assets.com/homepage/spa-assets/images/assets-images-site-homepage-icons-contact_icon_locations_red-CSX54c6594a.svg",
    locations:[200,5000,1400,2400,4500,20000]
  },
  {
    src:"https://upload.wikimedia.org/wikipedia/commons/b/b1/Yellow_card.svg",
    locations:[22000,10000]
  }
]
  $scope.a=6;
  $scope.x=function(){
    $scope.a=$scope.a+5
    $scope.items[1].locations.push($scope.a)
  }
  $scope.obj={value:0, options:{ceil:25000, floor:0, size:500, step:1 ,onChange:function(){}, items:$scope.items}}
   $scope.f=function(){
     $scope.obj.value--;
   }
  $scope.g=function(){
    $scope.obj.options.ceil=$scope.obj.options.ceil-40;
    $scope.obj.options.floor=$scope.obj.options.floor+40;
    // $scope.obj.options.size++;
   }
});

/* Controllers */

app.directive('d3slider', function() {
   //define the directive object
   var directive = {};
   directive.template="<div id='d3slider'></div> <button ng-click='handleRes()'>reset</button>"
   directive.scope = {
       d3slider:"="
   }
   function controller(scope){
        scope.handleRes=function(){ 
          scope.d3slider.options.floor=scope.d3slider.options.range[0];
          scope.d3slider.options.ceil=scope.d3slider.options.range[1];
          scope.$apply();
        } 
        scope.updateDOMSlider=function(value){
          console.log("updateDOM")
            var cx = scope.xScale(value);
            var xVal = value;
            scope.handle.attr('cx', cx);
            scope.handleText.attr("x",cx).text(scope.d3slider.value);    
        }

        scope.handleResize=function(size){
            var margin = {left: 20, right: 20},
                width = size-margin.left-margin.right,
                height = 90,
                range = [scope.d3slider.options.floor, scope.d3slider.options.ceil],
                step = 1; // change the step and if null, it'll switch back to a normal slider

            scope.step=step;
            var svg = d3.select('#d3slider').select('svg').transition()
                .attr('width', width)
                .attr('height', height);

            var slider = svg.select('g')
                .transition()
                .attr('transform', 'translate(' + margin.left +', '+ (height/2) + ')');

            // using clamp here to avoid slider exceeding the range limits
            scope.xScale = d3.scaleLinear()
                .domain(range)
                .range([0, width - margin.left - margin.right])
                .clamp(true);
            var xScale=scope.xScale

            // array useful for step sliders
            scope.rangeValues = d3.range(range[0], range[1], step || 1).concat(range[1]);
          var tickCount=297*(scope.d3slider.options.ceil-scope.d3slider.options.floor)/scope.d3slider.options.range[1]-(scope.d3slider.options.range[0])+3
            var rangeValues=d3.ticks(range[0], range[1],tickCount)
            console.log(scope.d3slider)
            xScale.clamp(true);
            // drag behavior initialization
            var drag = d3.drag()
                .on('start.interrupt', function () {
                    slider.interrupt();
                }).on('start drag', function () {
                    scope.dragged(d3.event.x);
                });

            // this is the main bar with a stroke (applied through CSS)
            slider.select('.track').attr('class', 'track').transition()
                .attr('x1', xScale.range()[0])
                .attr('x2', xScale.range()[1]);

            slider.selectAll("image")
              .style("visibility", function(d){
                if(d < scope.d3slider.options.floor || d > scope.d3slider.options.ceil){
                  return "hidden"
                }
                return "visible"
              })
              .attr('x', function(d){return xScale(d)-10});

            slider.select('.track-inset').transition()
                    .attr('x1', xScale.range()[0])
                    .attr('x2', xScale.range()[1]);

var xAxis = d3.axisBottom(xScale).tickValues(rangeValues).tickFormat(function (d) {
        return "";
    });
 scope.ticks.transition().call(xAxis);
            // this is the bar on top of above tracks with stroke = transparent and on which the drag behaviour is actually called
            // try removing above 2 tracks and play around with the CSS for this track overlay, you'll see the difference
         slider.select('.track-overlay').transition()
                    .attr('x1', xScale.range()[0])
                    .attr('x2', xScale.range()[1]);
        }
        scope.$watch(function () {
                    return scope.d3slider;
                }, function(news, old) { // data değişkeni izlensin
            scope.handleResize(news.options.size);
            scope.updateDOMSlider(news.value);
            console.log("sliderDom updated")
            scope.d3slider.options.onChange();
            if(!angular.equals(news.options.items,old.options.items)){
                console.log("dasda")
                console.log(news.options.items)
                console.log(old.options.items)
                scope.addItems()
            }
        }, true);
        scope.dragged=function(value) {
            var x = scope.xScale.invert(value), index = null, midPoint, cx, xVal;
            var xScale=scope.xScale;
            var rangeValues=scope.rangeValues;
            if(scope.step) {
                // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
                for (var i = 0; i < rangeValues.length - 1; i++) {
                    if (x >= rangeValues[i] && x <= rangeValues[i + 1]) {
                        index = i;
                        break;
                    }
                }
                midPoint = (rangeValues[index] + rangeValues[index + 1]) / 2;
                if (x < midPoint) {
                    cx = xScale(rangeValues[index]);
                    xVal = rangeValues[index];
                } else {
                    cx = xScale(rangeValues[index + 1]);
                    xVal = rangeValues[index + 1];
                }
            } else {
                // if step is null or 0, return the drag value as is
                cx = xScale(x);
                xVal = x.toFixed(3);
            }
            // use xVal as drag value

            scope.d3slider.value=xVal;
            console.log( xVal )
            
        }
        scope.addItems=function(){              
          scope.items=[]
          scope.d3slider.options.items.forEach(function(d){
            var items=scope.slider.selectAll("items").data(d.locations).enter()
                      .append("image")
                      .attr("data-toggle", "tooltip")
                      .attr("href",function(){return d.src})
                      .attr('x', function(dd){return scope.xScale(dd)-10})
                      .attr("y","-30px")
                      .style("width","15")
                      .style("height","20") 
            items.append("title").html(function(d){return " 22:30 \nGalatasaray \nHasan Şaş \nAsist"})
            scope.items.push(items)
          })
        }
        scope.init=function(){
          var margin = {left: 20, right: 20},
              width = +(d3.select('#d3slider').style("width")).slice(0,-2)-margin.left-margin.right,
              height = 90,
              range = [scope.d3slider.options.floor, scope.d3slider.options.ceil],
              step = 1; // change the step and if null, it'll switch back to a normal slider
  
          scope.d3slider.options.range=[scope.d3slider.options.floor, scope.d3slider.options.ceil];
          var svg = d3.select('#d3slider').append('svg')
              .attr('width', width)
              .attr('height', height);
          
          
          svg.call(d3.drag()
                     .on("start", dragstarted)
                     .on("drag", dragged)
                     .on("end", dragended))
          scope.dragStartx;
          scope.dragFinishx;
          scope.dragStarty;
          scope.dragFinishy;
          function dragstarted(d) {
            scope.dragStartx=d3.event.x;
            scope.dragStarty=d3.event.y;
            d3.select(this)
              .select(".rect").remove();
            d3.select(this)
              .append("rect")
              .attr("class", "rect");
          }

          function dragged(d) {
            d3.select(this)
              .select(".rect")
              .attr("x", scope.dragStartx)
              .attr("y", d3.min([scope.dragStarty, d3.event.y]))
              .attr("height", Math.abs(d3.event.y-scope.dragStarty) )
              .attr("width", d3.event.x-scope.dragStartx)
              .attr("fill", "black")
              .style("opacity", "0.3")
          }
          function dragended(d) {
            d3.select(this).select(".rect").remove();
            scope.dragFinishx=d3.event.x;
            scope.d3slider.options.ceil=Math.ceil(scope.xScale.invert(scope.dragFinishx-margin.left));
            scope.d3slider.options.floor=Math.floor(scope.xScale.invert(scope.dragStartx-margin.left));
            scope.$apply()
            console.log( scope.d3slider.options.ceil, scope.d3slider.options.floor)
          }
          
          scope.slider = svg.append('g')
              .classed('slider', true)
              .attr('transform', 'translate(' + margin.left +', '+ (height/2) + ')');
          var slider=scope.slider;
          // using clamp here to avoid slider exceeding the range limits
          scope.xScale = d3.scaleLinear()
              .domain(range)
              .range([0, width - margin.left - margin.right])
              .clamp(true);
          var xScale=scope.xScale;

          // array useful for step sliders
          scope.rangeValues = d3.ticks(range[0], range[1], step || 1).concat(range[1]);
          var rangeValues=scope.rangeValues

          xScale.clamp(true);
          // drag behavior initialization
          var drag = d3.drag()
              .on('start.interrupt', function () {
                  slider.interrupt();
              }).on('start drag', function () {
                  scope.dragged(d3.event.x);
                  scope.$apply(); // since it is an d3 event angular needs to be updated manually
              });

          // this is the main bar with a stroke (applied through CSS)
          var track = slider.append('line').attr('class', 'track')
              .attr('x1', xScale.range()[0])
              .attr('x2', xScale.range()[1]);

         var zoomTrack = slider.append('line').attr('class', 'zoomTrack')
              .attr('transform', 'translate(0,100)')
              .attr('x1', xScale.range()[0])
              .attr('x2', xScale.range()[1]);

          scope.trackInset = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-inset');
          var xAxis = d3.axisBottom(xScale).tickValues(rangeValues).tickFormat(function (d) {
        return "";
    });
 scope.ticks = slider.append('g').attr('class', 'ticks').attr('transform', 'translate(0, 4)')
        .call(xAxis);
          // drag handle
          scope.handle = slider.append('circle').classed('handle', true)
              .attr('r', 8);
          scope.handleText= slider.append("text").style("text-anchor","middle").attr("y","-10px");

          // this is the bar on top of above tracks with stroke = transparent and on which the drag behaviour is actually called
          // try removing above 2 tracks and play around with the CSS for this track overlay, you'll see the difference
          scope.trackOverlay = d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-overlay')
              .call(drag);
           
          scope.addItems();
        }
        scope.init()
    }
   //restrict = E, signifies that directive is Element directive
    directive.link=controller;
    directive.restrict = 'E';
    
    return directive;
});

icons=[{
  data:[],
  img:"za"
}]
items=[
  {
    src:"https://www1.bac-assets.com/homepage/spa-assets/images/assets-images-site-homepage-icons-contact_icon_locations_red-CSX54c6594a.svg",
    locations:[2,5,14,24]
  },
  {
    src:"https://upload.wikimedia.org/wikipedia/commons/b/b1/Yellow_card.svg",
    locations:[22,29,36,25]
  }
]

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}