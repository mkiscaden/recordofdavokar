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
                let rules
                switch (rulesFilter) {
                    case "house":
                        rules = (item.houseRule != null && item.en_31) ? item.en_31 : item.en
                    break;
                    case "house_and_revised":
                        rules = item.en_31 ? item.en_31 : item.en
                     break;
                    case "official":
                        rules = item.en
                     break;
                    default:
                        rules = item.en_31 ? item.en_31 : item.en

                }

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

                let noviceMod = novice == item.en_31?.novice && item.houseRule != null;
                let adeptMod = adept == item.en_31?.adepte && item.houseRule != null;
                let masterMod = master == item.en_31?.maitre && item.houseRule != null;

                let noviceCheckbox = `<input type="checkbox" class="novice-box mastery-box" value="${noviceValue}" onchange="updateSelectedOptions(this)" data-mastery="Novice"/><span class='text-success'> Novice${noviceMod ? "<span class='mod-icon' title='Original: "+escapeHtmlForTitle(item.en?.novice)+"'>*</span>" : ""}</span> `;
                let adeptCheckbox = `<input type="checkbox" class="adept-box mastery-box" value="${adeptValue}"  onchange="updateSelectedOptions(this)" data-mastery="Adept"/><span class='text-info'> Adept${adeptMod ? "<span class='mod-icon' title='Original: "+escapeHtmlForTitle(item.en?.adepte)+"'>*</span>" : ""}</span> `;
                let masterCheckbox = `<input type="checkbox" class="master-box mastery-box" value="${masterValue}"  onchange="updateSelectedOptions(this)" data-mastery="Master"/><span class='text-danger'> Master${masterMod ? "<span class='mod-icon' title='Original: "+escapeHtmlForTitle(item.en?.maitre)+"'>*</span>" : ""}</span> `;

                let noviceHtml =  `<p>${showCheckbox ? noviceCheckbox : ""}<span class="Novice-text">${novice}</span></p>`;
                let adeptHtml = `<p>${showCheckbox ? adeptCheckbox : ""}<span  class="Adept-text">${adept}</span></p>`;
                let masterHtml = `<p>${showCheckbox ? masterCheckbox : ""}<span class="Master-text">${master}</span></p>`;

                let houseRuleText = "None";
                if (item.en_31 != null) {
                    houseRuleText = item.houseRule != null  ? item.houseRule : "Revised Wording";
                }
                let houseRule = `<p class="text-sm text-gray-400">House Changes: ${houseRuleText}</p>`;

                let isArmor = type === "Armor";
                let isWeapon = type === "Weapon";
                let isElixir = type === "Potion";
                let justInTimeAllowed = item.justInTime == false ? "No" : "Yes";
                let qualities = rules.qualites != null ? `Qualities: ${rules.qualites}` : "";


                 let armorCheckbox = `<input type="checkbox" class="armor-box mastery-box" onchange="updateSelectedArmor(this)"/>
                 <span class="protection-text"><span class="text-sm text-gray-400">Protection: ${item.caracs?.jet}<br>Type: ${item.caracs?.type} (${item.caracs?.gene} Defense)</span><br>
                 <span class="text-sm text-gray-400">Qualities: ${rules.qualites}</span></span>`;

                  let weaponCheckbox = `<input type="checkbox" class="weapon-box mastery-box" onchange="updateSelectedWeapon(this)"/>
                                  <span class="protection-text"><span class="text-sm text-gray-400">Damage: ${item.caracs?.jet}</span><br>
                                  <span class="text-sm text-gray-400">${qualities}</span></span>`;

                return `
                    <div class="card p-4 rounded" id="${name}">
                        <h2 class="font-bold text-amber-200">${name}</h2>
                        <p class="text-sm text-gray-400">Type: ${type}</p>
                        <p class="text-sm text-gray-400">${tradition}: ${rules.tradition || item.en?.tradition || item.en_31?.tradition || 'None'}</p>
                        <p class="text-sm text-gray-400">Source: ${source}</p>
                         ${isElixir ? `<p class="text-sm text-gray-400">Just In Time Alchemy: ${justInTimeAllowed}</p>` : ''}
                        ${ rulesFilter === 'house' ? houseRule : "" }
                        <p class="text-sm text-gray-300 mt-2">${rules.description || item.en?.description || item.en_31?.description || ''}</p>
                         ${isArmor ? armorCheckbox : ""}
                         ${isWeapon ? weaponCheckbox : ""}
                        <div class="mt-2">

                            ${novice ? noviceHtml : ""}
                            ${adept ? adeptHtml : ""}
                            ${master ? masterHtml : ""}
                        </div>
                        ${rules.materiel ? `<p class="text-sm text-gray-400 mt-2">Material: ${rules.materiel || item.en?.materiel || item.en_31?.materiel}</p>` : ''}
                        ${rules.source ? `<p class="text-sm text-gray-400 mt-2">Fan Site: ${rules.source || item.en?.source || item.en_31?.source}</p>` : ''}
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


        function sortItems(items) {

            return [...items].sort((a, b) => {
                 valA = (a.en?.nom || a.en_31?.nom || '').toLowerCase();
                 valB = (b.en?.nom || b.en_31?.nom || '').toLowerCase();
                return valA.localeCompare(valB);
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
                rules: 'house'
            };

            function updateDisplay() {
                let filteredItems = filterItems(items, currentFilters);
                filteredItems = sortItems(filteredItems);
                displayItems(filteredItems, currentFilters.rules);
            }

            document.getElementById('search').addEventListener('input', (e) => {
                currentFilters.search = e.target.value.toLowerCase();
                updateDisplay();
            });

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

            displayItems(sortItems(items), currentFilters.rules);
        }

        window.onload = init;



        const selectedList = document.getElementById('selected-list');
        const totalPointsDisplay = document.getElementById('total-points');
        let totalPoints = 0;

        function updateSelectedOptions(checkbox) {
            let card = checkbox.closest('div.card');
            let rank = checkbox.getAttribute("data-mastery");
            let title = card.querySelector("."+rank+"-text")?.innerHTML;
            let id = card.id +"_"+rank;
               if (checkbox.checked) {
                    totalPoints += parseInt(checkbox.value);
                    const li = document.createElement('li');
                    li.id = id;
                    li.innerHTML = checkbox.closest('div.card').id +" : "+ rank +"<span class='question-icon' title='"+ escapeHtmlForTitle(title)+"'>?</span>";
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

         const selectedArmor = document.getElementById('armor-select');

         function updateSelectedArmor(checkbox) {
            let card = checkbox.closest('div.card');
            let title = card.querySelector(".Novice-text")?.innerHTML;
            let id = card.id+"_armor";

            document.getElementById("armor-select").innerHTML = "";

               if (checkbox.checked) {
                     const div = document.createElement('div');
                      div.id = id;
                    div.innerHTML = card.id +"<span class='question-icon' title='"+ escapeHtmlForTitle(title)+"'>?</span><br>" +
                    card.querySelector(".protection-text")?.innerHTML;
                    div.title = title;

                     selectedArmor.appendChild(div);
               } else {
                    const listItem = document.getElementById(id);
                    if (listItem) {
                        listItem.remove();
                    }
                    document.getElementById("armor-select").innerHTML = "-";
               }
        }

            const selectedWeapon = document.getElementById('weapon-select');

           function updateSelectedWeapon(checkbox) {
             let card = checkbox.closest('div.card');
             let title = card.querySelector(".Novice-text")?.innerHTML;
             let id = card.id+"_weapon";

             document.getElementById("weapon-select").innerHTML = "";

                if (checkbox.checked) {
                      const div = document.createElement('div');
                       div.id = id;
                     div.innerHTML = card.id +"<span class='question-icon' title='"+ escapeHtmlForTitle(title)+"'>?</span><br>" +
                     card.querySelector(".protection-text")?.innerHTML;
                     div.title = title;

                      selectedWeapon.appendChild(div);
                } else {
                     const listItem = document.getElementById(id);
                     if (listItem) {
                         listItem.remove();
                     }
                     document.getElementById("weapon-select").innerHTML = "-";
                }
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

        function escapeHtmlForTitle(str) {
            const entityMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;'
            };
            return String(str).replace(/[&<>"'/]/g, char => entityMap[char]);
        }

    function copyDivToClipboard(divId) {
        const div = document.getElementById(divId);
        if (!div) {
            console.error('Div not found');
            return false;
        }

        // Function to convert HTML to Google Docs-compatible plain text
        function convertToGoogleDocsFormat(element) {
            let text = '';

            // Handle different node types
            function processNode(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    return node.textContent.trim();
                }
                if (node.nodeType !== Node.ELEMENT_NODE) {
                    return '';
                }

                // Skip elements with class "question-icon"
                if (node.classList && node.classList.contains('question-icon')) {
                    return '';
                }

                let result = '';
                const tagName = node.tagName.toLowerCase();

                if (tagName === 'li') {
                    const title = node.getAttribute('title') || '';
                     const titleText = title ? `${title}` : '';
                    // Format as a bulleted list item with a hyphen (Google Docs auto-converts to bullets)
                    result += `- ${Array.from(node.childNodes).map(processNode).join(' ').trim()}\n${titleText}\n\n`;
                } else if (tagName === 'select') {
                    // Format as a simple text table for the selected option
                    const selectedOption = node.options[node.selectedIndex];
                    if (selectedOption) {
                        result += ` - ${selectedOption.text}\n`;
                        result += `\n`; // Extra newline for clarity
                    }
                } else if (tagName === 'input') {
                    result += " - "+node.value;
                } else if (node.classList && node.classList.contains('char-sheet-item')) {
                    result += `${Array.from(node.childNodes).map(processNode).join('').trim()}\n\n`;
                } else if (tagName === 'div' || tagName === 'p' || tagName === 'h3' || tagName === 'h2' || tagName === 'h1') {
                    // Add newline after processing child nodes
                    result += `${Array.from(node.childNodes).map(processNode).join('').trim()}\n`;
                } else if (tagName === 'br' ) {
                    // Add a newline for <br> tags
                    result += `\n`;
                } else {
                    // Process child nodes
                    result += Array.from(node.childNodes).map(processNode).join('');
                }

                return result;
            }

            // Start processing from the root element
            text = processNode(element);

            return text.trim();
        }

        const googleDocsContent = convertToGoogleDocsFormat(div);
        console.log(googleDocsContent)

        // Use Clipboard API to copy
        try {
            navigator.clipboard.writeText(googleDocsContent);
            return true;
        } catch (err) {
            console.error('Copy failed:', err);
            // Fallback to execCommand
            const textarea = document.createElement('textarea');
            textarea.value = googleDocsContent;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return true;
            } catch (fallbackErr) {
                console.error('Fallback copy failed:', fallbackErr);
                document.body.removeChild(textarea);
                return false;
            }
        }
    }