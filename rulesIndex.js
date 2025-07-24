 async function loadData() {
            try {
                const response = await fetch('SymbaroumRules.json');
                if (!response.ok) throw new Error('Failed to fetch JSON data');
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('item-list').innerHTML = '<p class="text-red-400">Error loading data from the ancient tomes...</p>';
                return [];
            }
        }

        function displayItems(items, rulesFilter) {
            const itemList = document.getElementById('item-list');
            itemList.innerHTML = items.map(item => {
                const rules = rulesFilter === 'house' && item.en_31 ? item.en_31 : item.en || {};
                let source
                switch (item.livre) {
                    case "ldb":
                        source = "Core Rulebook";
                        break;
                    case "cdx":
                        source = "Codex";
                        break;
                    case "adv":
                        source = "Advanced Player's Guide";
                        break;
                    case "fanmade":
                        source = "Fan Made";
                        break;
                     case "gdj":
                        source = "Adventure Books";
                        break;
                    default:
                        source = item.livre;
                }

                let type;
                let baseValue = 10;
                let showCheckbox = true;
                switch (item.type) {
                    case "talent":
                        type = "Ability";
                        break;
                    case "trait monstrueux":
                        type = "Monstrous Trait";
                        break;
                    case "trait":
                        type = "Trait";
                        break;
                    case "atout":
                        type = "Boon";
                        baseValue = 5;
                        break;
                    case "fardeau":
                        type = "Burden";
                        baseValue = -5;
                        break;
                    case "pouvoir mystique":
                        type = "Mystical Power";
                        break;
                    case "arme":
                        type = "Weapon";
                        baseValue = 0;
                        showCheckbox = false;
                        break;
                    case "qualite":
                        type = "Quality";
                        baseValue = 0;
                        showCheckbox = false;
                        break;
                    case "elixir":
                        type = "Potion";
                        baseValue = 0;
                        showCheckbox = false;
                        break;
                    case "armure":
                        type = "Armor";
                        baseValue = 0;
                        showCheckbox = false;
                        break;
                    case "rituel":
                        type = "Ritual";
                        break;
                    case "trait/atout":
                        type = "Trait/Boon";
                        baseValue = 5;
                        break;
                    case "trait/fardeau":
                        type = "Trait/Burden";
                        baseValue = -5;
                        break;
                    default:
                        type = item.type;
                }

                let tradition
                if (item.type == "elixir") {
                    tradition = "Cost";
                } else {
                    tradition = "Tradition";
                }

                let name = rules.nom || item.en.nom || item.en_31?.nom || 'Unknown Ability'

                let noviceValue = baseValue;
                let adeptValue = baseValue*2;
                let masterValue = baseValue*3;

                let novice = rules.novice || item.en?.novice || item.en_31?.novice;
                let adept = rules.adepte || item.en?.adepte || item.en_31?.adepte;
                let master = rules.maitre || item.en?.maitre || item.en_31?.maitre;

                let noviceMod = rules.novice == item.en_31?.novice
                let adeptMod = rules.adepte == item.en_31?.adepte
                let masterMod = rules.maitre == item.en_31?.maitre

                let noviceCheckbox = `<input type="checkbox" class="novice-box mastery-box" value="${noviceValue}" onchange="updateSelectedOptions(this, 'Novice', '${novice}')" data-mastery="Novice"/><span class='text-success'> Novice${noviceMod ? "*" : ""}</span> `;
                let adeptCheckbox = `<input type="checkbox" class="adept-box mastery-box" value="${adeptValue}"  onchange="updateSelectedOptions(this, 'Adept', '${adept}')" data-mastery="Adept"/><span class='text-info'> Adept${adeptMod ? "*" : ""}</span> `;
                let masterCheckbox = `<input type="checkbox" class="master-box mastery-box" value="${masterValue}"  onchange="updateSelectedOptions(this, 'Master', '${master}')" data-mastery="Master"/><span class='text-danger'> Master${masterMod ? "*" : ""}</span> `;

                let noviceHtml =  `<p>${showCheckbox ? noviceCheckbox : ""}${novice}</p>`;
                let adeptHtml = `<p>${showCheckbox ? adeptCheckbox : ""}${adept}</p>`;
                let masterHtml = `<p>${showCheckbox ? masterCheckbox : ""}${master}</p>`;
                return `
                    <div class="card p-4 rounded" id="${name}">
                        <h2 class="font-bold text-amber-200">${name}</h2>
                        <p class="text-sm text-gray-400">Type: ${type}</p>
                        <p class="text-sm text-gray-400">Attribute: ${item.attribut || 'None'}</p>
                        <p class="text-sm text-gray-400">${tradition}: ${rules.tradition || item.en?.tradition || item.en_31?.tradition || 'None'}</p>
                        <p class="text-sm text-gray-400">Source: ${source}</p>
                        <p class="text-sm text-gray-300 mt-2">${rules.description || item.en?.description || item.en_31?.description || 'No description available.'}</p>
                        <div class="mt-2">
                            ${novice ? noviceHtml : ""}
                            ${adept ? adeptHtml : ""}
                            ${master ? masterHtml : ""}
                        </div>
                        ${rules.materiel ? `<p class="text-sm text-gray-400 mt-2">Material: ${rules.materiel || item.en?.materiel || item.en_31?.materiel}</p>` : ''}
                        ${rules.source ? `<p class="text-sm text-gray-400 mt-2">Source: ${rules.source || item.en?.source || item.en_31?.source}</p>` : ''}
                    </div>
                `;
            }).join('');

             const checkboxes = document.querySelectorAll('.mastery-box');
             checkboxes.forEach(checkbox => {
                let id = checkbox.closest('div.card').id +"_"+checkbox.getAttribute("data-mastery");
                const listItem = document.getElementById(id);
                checkbox.checked = (listItem != null);
            });

        }


        function sortItems(items, sortBy) {
            const [key, direction] = sortBy.split('-');
            return [...items].sort((a, b) => {
                let valA, valB;
                if (key === 'name') {
                    valA = (a.en?.nom || a.en_31?.nom || '').toLowerCase();
                    valB = (b.en?.nom || b.en_31?.nom || '').toLowerCase();
                } else if (key === 'attribute') {
                    valA = (a.attribut || '').toLowerCase();
                    valB = (b.attribut || '').toLowerCase();
                } else if (key === 'tradition') {
                    valA = (a.en?.tradition || a.fr?.tradition || '').toLowerCase();
                    valB = (b.en?.tradition || b.fr?.tradition || '').toLowerCase();
                }
                return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            });
        }

        function filterItems(items, filters) {
            return items.filter(item => {
                const typeMatch = !filters.type || item.type.includes(filters.type);
                const hiddenMatch = item.hidden !== "true";
                const traditionMatch = !filters.tradition ||
                    (item.en?.tradition && item.en.tradition.includes(filters.tradition)) ||
                    (item.fr?.tradition && item.fr.tradition.includes(filters.tradition)) ||
                    (item.en?.tradition === 'Witchcraft' && filters.tradition === 'Witchcraft');
                const sourceMatch = !filters.source || item.livre === filters.source;
                const searchMatch = !filters.search ||
                    (item.en?.nom || '').toLowerCase().includes(filters.search) ||
                    (item.en_31?.nom || '').toLowerCase().includes(filters.search) ||
                    (item.fr?.nom || '').toLowerCase().includes(filters.search) ||
                    (item.en?.description || '').toLowerCase().includes(filters.search) ||
                    (item.en_31?.description || '').toLowerCase().includes(filters.search);
                return typeMatch && traditionMatch && sourceMatch && searchMatch && hiddenMatch;
            });
        }

        async function init() {
            let items = await loadData();
            let currentFilters = {
                type: '',
                tradition: '',
                source: '',
                search: '',
                rules: 'official'
            };

            function updateDisplay() {
                let filteredItems = filterItems(items, currentFilters);
                filteredItems = sortItems(filteredItems, document.getElementById('sort').value);
                displayItems(filteredItems, currentFilters.rules);
            }

            document.getElementById('search').addEventListener('input', (e) => {
                currentFilters.search = e.target.value.toLowerCase();
                updateDisplay();
            });

            document.getElementById('sort').addEventListener('change', updateDisplay);

            document.getElementById('filter-type').addEventListener('change', (e) => {
                currentFilters.type = e.target.value;
                updateDisplay();
            });

            document.getElementById('filter-tradition').addEventListener('change', (e) => {
                currentFilters.tradition = e.target.value;
                updateDisplay();
            });

            document.getElementById('filter-source').addEventListener('change', (e) => {
                currentFilters.source = e.target.value;
                updateDisplay();
            });

            document.getElementById('filter-rules').addEventListener('change', (e) => {
                currentFilters.rules = e.target.value;
                updateDisplay();
            });

            displayItems(items, currentFilters.rules);
        }

        window.onload = init;



        const selectedList = document.getElementById('selected-list');
        const totalPointsDisplay = document.getElementById('total-points');
        let totalPoints = 0;

        function updateSelectedOptions(checkbox, rank, title) {
            let id = checkbox.closest('div.card').id +"_"+checkbox.getAttribute("data-mastery");
               if (checkbox.checked) {
                    totalPoints += parseInt(checkbox.value);
                    const li = document.createElement('li');
                    li.id = id;
                    li.innerHTML = checkbox.closest('div.card').id +" : "+ rank +"<span class='question-icon' title='"+title+"'>?</span>";
                    li.title = title;
                    selectedList.appendChild(li);
               } else {
                 totalPoints -= parseInt(checkbox.value);
                    const listItem = document.getElementById(id);
                    if (listItem) {
                        listItem.remove();
                    }
               }

            totalPointsDisplay.textContent = `Total Points: ${totalPoints}`;
        }

         // Handle dropdown change to enforce unique values and swap duplicates
        function handleDropdownChange(currentSelect) {
            const allSelects = document.querySelectorAll('#dropdownContainer select');
            const currentValue = currentSelect.value;

            // If no value selected, do nothing
            if (!currentValue) return;

            // Find any other dropdown with the same value
            allSelects.forEach(otherSelect => {
                if (otherSelect !== currentSelect && otherSelect.value === currentValue) {
                    // Swap values: set other select to current select's previous value
                    otherSelect.value = currentSelect.dataset.previousValue || '';
                }
            });

            // Store the current value as previous for future swaps
            currentSelect.dataset.previousValue = currentValue;
        }

        // Initialize previous values for all dropdowns
        document.querySelectorAll('#dropdownContainer select').forEach(select => {
            select.dataset.previousValue = select.value;
        });