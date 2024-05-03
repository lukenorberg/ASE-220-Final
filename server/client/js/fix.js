const fs = require('fs');

// Function to round a number to the nearest multiple of 5
function roundToNearest5(number) {
    return Math.round(number / 5) * 5;
}

readfile();

// Read the JSON file
function readfile() {
    fs.readFile('../../blobs/recipes.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        // Parse the JSON data
        const recipes = JSON.parse(data);

        // Iterate over each recipe object
        recipes.forEach(recipe => {
            const prepTimeMatch = recipe.prep_time.match(/(\d+)\s*hour/);
            const prepTimeHours = prepTimeMatch ? parseInt(prepTimeMatch[1]) : 0;
            const prepTimeMinutesMatch = recipe.prep_time.match(/(\d+)\s*minute/);
            var prepTimeMinutes = prepTimeMinutesMatch ? parseInt(prepTimeMinutesMatch[1]) : 0;
            prepTimeMinutes = roundToNearest5(prepTimeMinutes);

            // Add prep_time_hours and prep_time_minutes properties
            recipe.prep_time_hours = prepTimeHours;
            recipe.prep_time_minutes = prepTimeMinutes;


            let hours = " hours, ";
            if (prepTimeHours == 1) { hours = " hour, "; }
            const minutes = " minutes";
            recipe.prep_time = prepTimeHours + hours + prepTimeMinutes + minutes;

            // Cook time
            const cookTimeMatch = recipe.cook_time.match(/(\d+)\s*hour/);
            const cookTimeHours = cookTimeMatch ? parseInt(cookTimeMatch[1]) : 0;
            const cookTimeMinutesMatch = recipe.cook_time.match(/(\d+)\s*minute/);
            var cookTimeMinutes = cookTimeMinutesMatch ? parseInt(cookTimeMinutesMatch[1]) : 0;

            cookTimeMinutes = roundToNearest5(cookTimeMinutes);

            // Add cook_time_hours and cook_time_minutes properties
            recipe.cook_time_hours = cookTimeHours;
            recipe.cook_time_minutes = cookTimeMinutes;

            hours = " hours, ";
            if (cookTimeHours == 1) { hours = " hour, "; }
            recipe.cook_time = cookTimeHours + hours + cookTimeMinutes + minutes;

            // Convert servings to a number
            recipe.servings = parseInt(recipe.servings);

            // Function to convert time string to minutes
            function timeToMinutes(timeStr) {
                const [hours, minutes] = timeStr.split(',').map(part => parseInt(part.trim()));
                return hours * 60 + minutes;
            }

            // Update total time for each recipe
            recipes.forEach(recipe => {
                const prepTime = timeToMinutes(recipe.prep_time);
                const cookTime = timeToMinutes(recipe.cook_time);
                const totalTime = prepTime + cookTime;
                const totalHours = Math.floor(totalTime / 60);
                const totalMinutes = totalTime % 60;
                recipe.total_time = `${totalHours} hours, ${totalMinutes} minutes`;
            });
        });

        // Write the modified JSON back to the file
        fs.writeFile('modified_recipes.json', JSON.stringify(recipes, null, 2), err => {
            if (err) {
                console.error("Error writing file:", err);
                return;
            }
            console.log("File has been modified and saved.");
        });
    });
}
