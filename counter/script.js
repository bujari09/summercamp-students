let plus = 0;
        function shto(){
            plus++;
            document.querySelector('h1').innerHTML = plus;
        }
         
        let minus = 0;
        function hiq(){
            minus--;
            document.querySelector('h2').innerHTML = minus;
        }

        function restarto(){
            plus = 0;
            minus = 0;
            document.querySelector('h1').innerHTML = plus;
            document.querySelector('h2').innerHTML = minus;
        }