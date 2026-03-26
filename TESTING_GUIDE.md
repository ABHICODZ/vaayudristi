# Testing Guide - Profile Feature Improvements

## Prerequisites
1. Frontend running on http://localhost:5173
2. Backend running on http://localhost:8080 (optional for this test)
3. Database migration applied (add_phone_number_column.sql)

## Test Scenarios

### Scenario 1: Profile Button Visibility
**Expected Behavior**: Profile button should always be visible when logged in

**Steps**:
1. Open http://localhost:5173
2. Login with your credentials
3. Look at the top-right corner of the header
4. You should see a rounded button with:
   - Your initial in a circle (cyan background)
   - Your name (or "Citizen" if not set)
   - Your role ("CITIZEN AUTH" or "ADMIN AUTH")

**Success Criteria**:
- ✅ Button appears immediately after login
- ✅ Button shows your initial/name
- ✅ Button is clickable

---

### Scenario 2: Navigate to Profile Page
**Expected Behavior**: Clicking profile button navigates to dedicated profile page

**Steps**:
1. Click the profile button in the header
2. URL should change to http://localhost:5173/profile
3. You should see a full-page profile form (not a modal/popup)
4. Page should have:
   - Header with back arrow
   - "User Profile" title
   - Profile Information section
   - Password Change section

**Success Criteria**:
- ✅ Navigation works (URL changes)
- ✅ Full page loads (not a modal)
- ✅ Back button visible in header
- ✅ All form fields visible

---

### Scenario 3: Edit Profile with Phone Number
**Expected Behavior**: Can add/edit phone number and save

**Steps**:
1. On profile page, fill in the fields:
   - Full Name: "Your Name"
   - Age: 25
   - Home Ward: "Punjabi Bagh"
   - Phone Number: "+91 9876543210"
   - Health Condition: Select "Asthma"
2. Click "Save Profile" button
3. Should see green success message
4. Click back arrow to return to dashboard
5. Click profile button again to return to profile page
6. All fields should still have your saved values

**Success Criteria**:
- ✅ All fields accept input
- ✅ Save button works
- ✅ Success message appears
- ✅ Data persists after navigation
- ✅ Phone number field works

---

### Scenario 4: Polished Scrollbar
**Expected Behavior**: Scrollbars should have custom cyan/blue styling

**Steps**:
1. Navigate to any page with scrollable content
2. Look at the scrollbar on the right side
3. Scrollbar should be:
   - Thin (8px width)
   - Cyan/blue gradient color
   - Dark track background
4. Hover over the scrollbar
5. Should see glow effect

**Success Criteria**:
- ✅ Scrollbar is thin and styled
- ✅ Gradient color visible
- ✅ Hover effect works
- ✅ Matches app aesthetic

---

### Scenario 5: Change Password
**Expected Behavior**: Can change password from profile page

**Steps**:
1. On profile page, scroll to "Change Password" section
2. Enter new password in "New Password" field
3. Enter same password in "Confirm Password" field
4. Click "Change Password" button
5. Should see success message
6. Try logging out and back in with new password

**Success Criteria**:
- ✅ Password fields accept input
- ✅ Validation works (matching passwords)
- ✅ Success message appears
- ✅ Can login with new password

---

### Scenario 6: Health Condition Dropdown
**Expected Behavior**: Can select health condition from dropdown

**Steps**:
1. On profile page, find "Health Condition" dropdown
2. Click the dropdown
3. Should see options:
   - None
   - Asthma
   - COPD
   - Heart Disease
   - Respiratory Issues
4. Select one and save
5. Refresh page - selection should persist

**Success Criteria**:
- ✅ Dropdown shows all options
- ✅ Can select an option
- ✅ Selection saves
- ✅ Selection persists

---

## Common Issues & Solutions

### Issue: Profile button not showing
**Solution**: 
- Hard refresh browser (Ctrl+Shift+R)
- Check if you're logged in
- Check browser console for errors

### Issue: Phone number not saving
**Solution**:
- Ensure database migration was applied
- Check backend is running
- Check browser console for API errors

### Issue: Navigation not working
**Solution**:
- Clear browser cache
- Restart frontend server
- Check for JavaScript errors in console

### Issue: Scrollbar not styled
**Solution**:
- Hard refresh browser
- Check if index.css changes were applied
- Try different browser (Chrome/Firefox)

---

## Browser Compatibility
- ✅ Chrome/Edge (Chromium) - Full support
- ✅ Firefox - Full support (with scrollbar-width)
- ⚠️ Safari - Scrollbar styling may differ

---

## Quick Checklist
Use this checklist to verify all improvements:

- [ ] Profile button visible in header when logged in
- [ ] Profile button shows user initial/name
- [ ] Clicking profile button navigates to /profile
- [ ] Profile page is full-page (not modal)
- [ ] Back button works
- [ ] Phone number field present
- [ ] Phone number saves and persists
- [ ] Health condition dropdown works
- [ ] Password change works
- [ ] Scrollbars are styled (cyan/blue gradient)
- [ ] Scrollbar hover effect works
- [ ] All form validations work
- [ ] Success/error messages display correctly

---

## Next Steps After Testing
1. If all tests pass, commit changes to feature branch
2. Create pull request to merge to main
3. Document any issues found
4. Plan SMS notifications feature (separate branch)
